from pathlib import Path
from hashlib import sha256
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, KeepTogether, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[2]
ORIGINAL = ROOT / 'public/PHIVUONGTUONGTAM_RESUME.pdf'
original_hash = sha256(ORIGINAL.read_bytes()).hexdigest()
OUT = Path(__file__).with_name('PHI_VUONG_TUONG_TAM_FRONTEND_RESUME.pdf')
for name, filename in [('Arial', 'arial.ttf'), ('ArialBold', 'arialbd.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(Path('C:/Windows/Fonts') / filename)))
pdfmetrics.registerFontFamily('Arial', normal='Arial', bold='ArialBold')
ink = accent = muted = HexColor('#202020')
styles = {
    'name': ParagraphStyle('name', fontName='ArialBold', fontSize=24, leading=29, textColor=ink, alignment=TA_CENTER, spaceAfter=9),
    'role': ParagraphStyle('role', fontName='Arial', fontSize=11, leading=16, textColor=accent),
    'contact': ParagraphStyle('contact', fontName='Arial', fontSize=9.2, leading=13, textColor=ink, alignment=TA_CENTER),
    'body': ParagraphStyle('body', fontName='Arial', fontSize=10, leading=12.5, textColor=ink),
    'heading': ParagraphStyle('heading', fontName='ArialBold', fontSize=11.5, leading=15, textColor=ink, spaceBefore=10, spaceAfter=4, keepWithNext=True),
    'entry': ParagraphStyle('entry', fontName='ArialBold', fontSize=10.3, leading=14, textColor=ink, spaceAfter=3),
    'date': ParagraphStyle('date', fontName='ArialBold', fontSize=10, leading=14, textColor=ink, alignment=TA_RIGHT),
    'meta': ParagraphStyle('meta', fontName='Arial', fontSize=10, leading=12.5, textColor=ink, spaceAfter=3),
    'bullet': ParagraphStyle('bullet', fontName='Arial', fontSize=10, leading=12.5, textColor=ink, leftIndent=24, bulletIndent=10, bulletFontName='Arial', bulletFontSize=10, spaceAfter=3),
}
story=[]
def p(text, kind='body'):
    return Paragraph(text, styles[kind])
def add(text, kind='body'):
    story.append(p(text, kind))
def heading(text):
    add(text.upper(), 'heading')
    story.append(HRFlowable(width='100%', thickness=.5, color=HexColor('#888888'), spaceAfter=5))
def entry(title, meta, bullets, date=''):
    if date:
        row=Table([[p(title,'entry'), p(date,'date')]], colWidths=[343.276,168], hAlign='LEFT')
        row.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'), ('LEFTPADDING',(0,0),(-1,-1),0), ('RIGHTPADDING',(0,0),(-1,-1),0), ('TOPPADDING',(0,0),(-1,-1),0), ('BOTTOMPADDING',(0,0),(-1,-1),3)]))
        content=[row]
    else:
        content=[p(title, 'entry')]
    if meta: content.append(p(meta, 'meta'))
    content.extend(Paragraph(line, styles['bullet'], bulletText='\u2022') for line in bullets)
    content.append(Spacer(1,2))
    story.append(KeepTogether(content))
def link(url, label):
    return f'<link href="{url}" color="#202020">{label}</link>'

add('PHI VUONG TUONG TAM', 'name')
add('Ho Chi Minh City \u2022 (+84) 938419071 \u2022 ' + link('mailto:tamphi5002@gmail.com','tamphi5002@gmail.com') + ' \u2022 ' + link('https://github.com/tamir39','github.com/tamir39'), 'contact')
story.append(HRFlowable(width='97%', thickness=.8, color=ink, spaceBefore=9, spaceAfter=1, hAlign='CENTER'))

heading('Education')
entry('TON DUC THANG UNIVERSITY | Ho Chi Minh City', 'Bachelor of Computer Science | Expected graduation: June 2027', [
    'Coursework: Object-Oriented Programming, Data Structures &amp; Algorithms, Introduction to AI, Software Engineering, Mobile Apps Development, Web Programming.',
], 'Aug 2023 - Present')

heading('Professional Experience')
entry('TWOHEARTS TECHNOLOGY', 'Frontend Developer &amp; UI/UX Designer', [
    'Design and implement responsive interfaces, user flows, visual refinements, and frontend integrations for dashboard and storefront experiences.',
    'Built the Twohearts.vn landing experience with interactive product demos, a savings calculator, and a bilingual signup flow; worked on Joi.vn menu discovery, product customization, and checkout interfaces.',
], 'Jun 2026 - Present')
entry('100B.STUDIO', 'Co-founder &amp; Frontend Developer', [
    'Co-founded an engineering studio and developed its public website using Next.js, React, TypeScript, Tailwind CSS, Canvas 2D, and Framer Motion.',
    'Implemented a configurable wireframe hero, animated capability diagrams, a scroll-linked process timeline, and a project-inquiry flow.',
], 'Apr 2026 - Present')

heading('Selected projects')
entry('Zuno - Full-stack PWA', link('https://zuno-lyart.vercel.app/','Live application') + ' | Next.js, TypeScript', [
    'Connected authentication, private Class Zones, posts, and voting with expressive timelines, app installation, update prompts, and contextual push notifications.',
], 'Started May 2026')
entry('EnStudy-Hub - Vocabulary learning application', 'Frontend Developer &amp; UI/UX Designer | ' + link('https://en-study-hub.vercel.app/','Public alpha'), [
    'Designed and implemented the frontend for vocabulary collections, CSV import previews, review sessions, keyboard interactions, and learning-progress visualizations using Next.js and TypeScript.',
], 'Started May 2026')
entry('CausaSent - Academic data-mining project', 'Ton Duc Thang University | Next.js, TypeScript, FastAPI, Server-Sent Events', [
    'Developed a Vietnamese review-analysis dashboard connecting text or CSV input to streamed progress, aspect charts, action priorities, and searchable evidence.',
], 'Started May 2026')

heading('Recognition')
add('<b>F&amp;B Track winner - Agentic AI Build Week 2026</b> | Team Twohearts', 'body')
add('Organized by GenAI Fund; F&amp;B track partner: KFC Vietnam.', 'meta')

heading('Additional Information')
add('<b>Frontend:</b> React, Next.js, TypeScript, Tailwind CSS, Framer Motion, responsive design, PWA')
add('<b>Design &amp; delivery:</b> Figma, UI/UX design, interaction design, application flows, functional and integration testing, Agile/Scrum')
add('<b>Languages:</b> Vietnamese, English')

doc=SimpleDocTemplate(str(OUT), pagesize=(595.276,841.89), rightMargin=36, leftMargin=36, topMargin=34, bottomMargin=28, title='Phi Vuong Tuong Tam - Frontend Developer & UI/UX Designer', author='Phi Vuong Tuong Tam')
doc.build(story)
assert sha256(ORIGINAL.read_bytes()).hexdigest() == original_hash, 'Original changed'
print(OUT)
print('Original PDF unchanged: ' + original_hash)
