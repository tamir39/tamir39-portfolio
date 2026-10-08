param(
  [ValidateRange(1024, 65476)]
  [int]$StartPort = 5260,
  [string]$LanAddress = $env:PORTFOLIO_LAN_IP,
  [switch]$CheckOnly
)

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

function Get-PortfolioLanAddresses {
  # Wi-Fi first: VPN adapters can advertise both an IPv4 address and a gateway.
  # Use .NET to avoid a dependency on CIM access for adapter discovery.
  $candidates = foreach ($adapter in [System.Net.NetworkInformation.NetworkInterface]::GetAllNetworkInterfaces()) {
    if ($adapter.OperationalStatus -ne [System.Net.NetworkInformation.OperationalStatus]::Up) { continue }
    $properties = $adapter.GetIPProperties()
    $addresses = @($properties.UnicastAddresses | Where-Object {
      $_.Address.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork -and
      $_.Address.IPAddressToString -notmatch '^(127\.|169\.254\.|0\.)'
    })
    foreach ($address in $addresses) {
      $ip = $address.Address.IPAddressToString
      if ($LanAddress) {
        if ($ip -eq $LanAddress) { [pscustomobject]@{ Address = $ip; Adapter = $adapter.Name; Priority = 0 } }
        continue
      }
      if (($adapter.Name + ' ' + $adapter.Description) -match '(Radmin|VPN|Loopback|vEthernet|WSL|Docker|Hyper-V|Bluetooth|TAP|TUN|WireGuard|Tailscale|ZeroTier|Hamachi|Virtual|VMware)') { continue }
      if ($adapter.NetworkInterfaceType -notin @([System.Net.NetworkInformation.NetworkInterfaceType]::Wireless80211, [System.Net.NetworkInformation.NetworkInterfaceType]::Ethernet)) { continue }
      $gateway = @($properties.GatewayAddresses | Where-Object {
        $_.Address.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork -and $_.Address.IPAddressToString -ne '0.0.0.0'
      })
      if ($gateway.Count -eq 0) { continue }
      $priority = if ($adapter.NetworkInterfaceType -eq [System.Net.NetworkInformation.NetworkInterfaceType]::Wireless80211) { 0 } else { 1 }
      [pscustomobject]@{ Address = $ip; Adapter = $adapter.Name; Priority = $priority }
    }
  }
  if ($LanAddress -and -not $candidates) { throw "PORTFOLIO_LAN_IP/LanAddress must be an active address on this computer: $LanAddress" }
  $candidates | Sort-Object Priority, Adapter, Address
}

function Show-PortfolioUrls {
  param([int]$Port)
  Write-Host "  Portfolio: http://localhost:$Port"
  try {
    $addresses = @(Get-PortfolioLanAddresses)
    if ($addresses.Count -eq 0) { Write-Host '  Phone/LAN: no active Wi-Fi/Ethernet address found.' }
    for ($index = 0; $index -lt $addresses.Count; $index++) {
      $label = if ($index -eq 0) { 'Phone/LAN' } else { 'Other LAN' }
      Write-Host "  $($label): http://$($addresses[$index].Address):$Port [$($addresses[$index].Adapter)]"
    }
    Write-Host '  Phone and computer must use the same local network.'
  } catch {
    Write-Host "  Phone/LAN: $($_.Exception.Message)"
  }
}

function Find-PortfolioPort {
  param([int]$FirstPort)
  foreach ($candidate in $FirstPort..($FirstPort + 59)) {
    # Reserve sibling apps' configured ports and Mission Control fallback ranges,
    # even when those apps are currently stopped.
    if ($candidate -in @(3000, 3006, 5173, 5174, 5175) -or ($candidate -ge 5180 -and $candidate -le 5249) -or ($candidate -ge 5433 -and $candidate -le 5435) -or $candidate -eq 6969) { continue }
    $probe = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $candidate)
    try {
      $probe.Server.ExclusiveAddressUse = $true
      $probe.Start()
      return $candidate
    } catch [System.Net.Sockets.SocketException] {
      Write-Host "[port]   $candidate unavailable; trying the next port."
    } finally {
      $probe.Stop()
    }
  }
  throw "No available portfolio port in $FirstPort-$($FirstPort + 59). Try run.bat 5300."
}

try {
  Write-Host ''
  Write-Host '=== Tamir39 Portfolio local runner ==='
  Write-Host "[folder] $PSScriptRoot"
  $nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
  $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
  if (-not $nodeCommand -or -not $npmCommand) {
    throw 'Node.js and npm were not found in PATH. Install Node.js 20 or newer, then reopen run.bat.'
  }
  $nodeVersion = & $nodeCommand.Source -p 'process.versions.node'
  if ($LASTEXITCODE -ne 0 -or [int]($nodeVersion.Split('.')[0]) -lt 20) {
    throw "Node.js 20 or newer is required. Detected: $nodeVersion"
  }
  Write-Host "[node]   $nodeVersion"
  $frontendPort = Find-PortfolioPort -FirstPort $StartPort
  Write-Host "[port]   $frontendPort"
  if ($CheckOnly) {
    Show-PortfolioUrls -Port $frontendPort
    Write-Host '[check]  Prerequisites and port selection passed. No server started.'
    exit 0
  }

  $nextEntry = Join-Path $PSScriptRoot 'node_modules\next\dist\bin\next'
  $requiredFiles = @($nextEntry, 'node_modules\react\package.json', 'node_modules\react-dom\package.json', 'node_modules\tailwindcss\package.json', 'node_modules\@tailwindcss\postcss\package.json')
  $missingFiles = @($requiredFiles | Where-Object { -not (Test-Path -LiteralPath $_) })
  if ($missingFiles.Count -gt 0) {
    Write-Host '[deps]   Installing missing or incomplete dependencies...'
    if (Test-Path -LiteralPath 'package-lock.json') {
      & $npmCommand.Source ci --no-audit --no-fund
    } else {
      & $npmCommand.Source install --no-audit --no-fund
    }
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed. Check the npm error above, your network connection, and available disk space.' }
    if (-not (Test-Path -LiteralPath $nextEntry)) { throw 'Next.js is still missing after installation.' }
  }

  Write-Host ''
  Write-Host '========================================'
  Show-PortfolioUrls -Port $frontendPort
  Write-Host '========================================'
  Write-Host 'Press Ctrl+C to stop this portfolio server.'
  Write-Host 'Existing processes are left running.'
  Write-Host ''

  # Foreground child only: no taskkill, no cleanup by port, no background helpers.
  # Next.js fails safely if another process claims the port after our probe.
  & $nodeCommand.Source $nextEntry dev --hostname 0.0.0.0 --port $frontendPort
  $serverExitCode = $LASTEXITCODE
  if ($serverExitCode -ne 0) { throw "Next.js exited with code $serverExitCode. See the startup error above." }
  exit 0
} catch {
  Write-Host ''
  Write-Host "[error] $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
