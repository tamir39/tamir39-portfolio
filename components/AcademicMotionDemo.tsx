"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Check, CreditCard, FileText, GitCompareArrows, Layers, MessageSquare, Pause, Play, ReceiptText, RotateCcw, ScanText, ShoppingBag, ShoppingCart, SlidersHorizontal, Target } from "lucide-react";
import { usePortfolioMotion } from "./providers/ThemeProvider";

type DemoKind = "point-of-sale" | "causasent" | "lawmate";
const stories = {
  "point-of-sale": {
    name: "Point of Sale", title: "A selection becomes a sale.",
    intro: "Follow the handoff from products and stock checks to a customer’s transaction and its saved receipt.",
    steps: [
      { name: "Select", icon: ShoppingBag, title: "Start with available products.", description: "Choose products and check stock before carrying quantities into the transaction." },
      { name: "Basket", icon: ShoppingCart, title: "Keep quantities and totals together.", description: "Two notebooks and one pen travel into the same basket. The example total follows those quantities." },
      { name: "Checkout", icon: CreditCard, title: "Connect the customer to the sale.", description: "Customer selection and transaction confirmation connect the basket to a completed order." },
      { name: "Receipt", icon: ReceiptText, title: "Give the transaction a lasting record.", description: "The completed order carries its line items and total into a receipt that can be inspected later." },
    ],
  },
  lawmate: {
    name: "LawMate", title: "One question. Four ways to explore it.",
    intro: "Follow configuration selection, a shared question, supporting context, and comparison across the academic demo’s four approaches.",
    steps: [
      { name: "Configure", icon: SlidersHorizontal, title: "Make the configuration visible.", description: "Base model, retrieval, fine-tuning, and the combined approach are explicit choices, rather than invisible changes behind an answer." },
      { name: "Question", icon: MessageSquare, title: "Keep the question consistent.", description: "The same sample question provides a common starting point for comparing the configurations. Loading and generation remain distinct states." },
      { name: "Context", icon: BookOpen, title: "Bring supporting passages within reach.", description: "Retrieval-enabled configurations expose their supporting passages alongside the answer, so the source context can be inspected." },
      { name: "Compare", icon: GitCompareArrows, title: "Compare the approaches, one run at a time.", description: "Comparison mode runs configurations sequentially, with one model loaded at a time. Side-by-side results make the experimental differences visible." },
    ],
  },
  causasent: {
    name: "CausaSent", title: "A review becomes a clearer signal.",
    intro: "Follow review input through visible processing, aspect summaries, and a priority traced back to its evidence.",
    steps: [
      { name: "Input", icon: MessageSquare, title: "Begin with the customer’s words.", description: "Text or CSV input becomes a review batch. This illustration uses three deliberately simple sample comments." },
      { name: "Stream", icon: ScanText, title: "Show progress as results arrive.", description: "Processing feedback and partial results make the long-running analysis visible, rather than hiding it behind a spinner." },
      { name: "Aspects", icon: Layers, title: "Turn individual results into patterns.", description: "Aspect and sentiment summaries let someone compare product quality, delivery, and packaging in the same batch." },
      { name: "Evidence", icon: Target, title: "Keep the source behind the priority.", description: "A delivery issue leads back to the original comment, connecting an action suggestion to review evidence." },
    ],
  },
} as const;

const reviews = [
  { text: "Sản phẩm đẹp", aspect: "Quality", sentiment: "Positive", tone: "positive" },
  { text: "Giao hàng chậm", aspect: "Delivery", sentiment: "Negative", tone: "negative" },
  { text: "Đóng gói bình thường", aspect: "Packaging", sentiment: "Neutral", tone: "neutral" },
] as const;

export function AcademicMotionDemo({ kind }: { kind: DemoKind }) {
  const { reduced } = usePortfolioMotion();
  const story = stories[kind];
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const playing = visible && tabVisible && !paused && !reduced;
  const region = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const current = story.steps[step];
  const transition = { duration: reduced ? 0 : .4, ease: "easeOut" as const };

  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setTimeout(() => {
      setStep(value => (value + 1) % story.steps.length);
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [playing, step, reduced, story.steps.length]);

  useEffect(() => {
    const stopWhenHidden = () => setTabVisible(!document.hidden);
    stopWhenHidden();
    document.addEventListener("visibilitychange", stopWhenHidden);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= .35), { threshold: [0, .35] });
    if (region.current) observer.observe(region.current);
    return () => { document.removeEventListener("visibilitychange", stopWhenHidden); observer.disconnect(); };
  }, []);

  const selectStep = (index: number) => { setPaused(true); setStep(index); };

  return <section className="academic-motion" aria-labelledby={headingId}>
    <div className="motion-story-heading">
      <div><p className="section-eyebrow">A flow in motion</p><h2 id={headingId}>{story.title}</h2><p>{story.intro}</p></div>
      <span className="motion-sample-label">Illustrative data · flow demonstration</span>
    </div>
    <div ref={region} className="motion-story-stage">
      <div className="motion-flow-path" aria-hidden="true">
        <span className="motion-flow-line" />
        <motion.span className="motion-flow-packet" animate={{ left: `${12.5 + step * 25}%` }} transition={transition} />
        {story.steps.map((item, index) => <span key={item.name} className="motion-flow-stop" data-reached={index <= step}><item.icon size={22} strokeWidth={1.5} /><span>{item.name}</span></span>)}
      </div>
      {kind === "point-of-sale" ? <div className="sale-visual" aria-hidden="true">
        <div className="sale-products">
          <p className="motion-diagram-label">Selected products</p>
          {[{ name: "Notebook", price: 18, quantity: 2 }, { name: "Pen", price: 4, quantity: 1 }].map((item, index) => <motion.div key={item.name} className="sale-product-token" animate={{ x: step > 0 ? 10 : 0, opacity: step === 3 ? .65 : 1 }} transition={transition}>
            <span className={`sale-product-shape shape-${index}`} /><span><strong>{item.name}</strong><small>{item.price} / unit</small></span><span className="sale-quantity">× {step > 0 ? item.quantity : 1}</span>
          </motion.div>)}
          <span className="sale-stock"><Check size={14} />Stock checked</span>
        </div>
        <div className="sale-total-orbit">
          <motion.div className="sale-total-circle" animate={{ scale: step === 1 ? 1.06 : 1, borderRadius: step >= 2 ? "24%" : "50%" }} transition={transition}>
            <small>{step === 0 ? "Unit subtotal" : "Basket total"}</small><strong>{step === 0 ? "22" : "40"}</strong><span>sample units</span>
          </motion.div>
          <span className="sale-handoff">{step < 2 ? "Products → quantities" : step === 2 ? "Customer → transaction" : "Transaction → record"}</span>
        </div>
        <div className="sale-receipt" data-complete={step === 3}>
          <ReceiptText size={26} strokeWidth={1.5} /><strong>{step === 3 ? "Order recorded" : "A record takes shape"}</strong>
          <div className="sale-receipt-lines"><motion.span animate={{ scaleX: step >= 1 ? 1 : .25 }} transition={transition} /><motion.span animate={{ scaleX: step >= 2 ? 1 : .25 }} transition={transition} /><motion.span animate={{ scaleX: step >= 3 ? 1 : .25 }} transition={transition} /></div>
          <span>{step === 3 ? "3 items · total 40" : step === 2 ? "Customer selected" : "Waiting for the handoff"}</span>
          <motion.span className="sale-receipt-check" animate={{ opacity: step === 3 ? 1 : 0, scale: step === 3 ? 1 : .8 }} transition={transition}><Check size={18} />Receipt ready</motion.span>
        </div>
      </div> : kind === "lawmate" ? <div className="lawmate-visual">
        <div><p className="motion-diagram-label">Four explicit configurations</p><div className="lawmate-configurations">{["Base model", "Retrieval · RAG", "Fine-tuning · QLoRA", "Combined"].map((label, index) => <motion.div key={label} className="lawmate-configuration" data-active={step === 0 ? index === 1 : step === 3} animate={{ opacity: step === 0 && index !== 1 ? .6 : 1 }} transition={transition}><span className="lawmate-config-number">0{index + 1}</span><strong>{label}</strong><span>{step === 3 ? "Result available" : index === 1 ? "Selected approach" : "Alternative approach"}</span></motion.div>)}</div></div>
        <div className="lawmate-context"><p className="motion-diagram-label">A shared question → visible context</p><motion.div className="lawmate-question" animate={{ opacity: step >= 1 ? 1 : .45 }} transition={transition}><MessageSquare size={18} aria-hidden="true" /><p>How do the four configurations handle the same question?</p></motion.div>
          <div className="lawmate-passages"><FileText size={20} aria-hidden="true" /><div><strong>{step >= 2 ? "Supporting passages available" : "Supporting context"}</strong><span>{step >= 2 ? "Inspect retrieved context beside the answer." : "Revealed for retrieval-enabled approaches."}</span><div className="lawmate-passage-lines" aria-hidden="true">{[1, .82, .6].map((width, index) => <motion.span key={index} animate={{ scaleX: step >= 2 ? width : .12 }} transition={transition} />)}</div></div></div>
          <motion.div className="lawmate-comparison" animate={{ opacity: step === 3 ? 1 : .4 }} transition={transition}><GitCompareArrows size={18} aria-hidden="true" /><span>{step === 3 ? "Same question · four result views" : "Configuration → question → context → comparison"}</span></motion.div>
        </div>
      </div> : <div className="sentiment-visual">
        <div className="sentiment-reviews">
          <p className="motion-diagram-label">Three sample reviews</p>
          {reviews.map((review, index) => <motion.div key={review.aspect} className="sentiment-review" data-evidence={step === 3 && index === 1} animate={{ x: step === 3 && index === 1 ? 6 : 0 }} transition={transition}>
            <MessageSquare size={15} aria-hidden="true" /><span lang="vi">{review.text}</span><span className="sentiment-tag" data-tone={review.tone}>{step > 0 ? review.sentiment : "Unprocessed"}</span>
          </motion.div>)}
          <p className="sentiment-progress">{step === 0 ? "Ready to analyze" : "3 / 3 sample results received"}</p>
          <div className="sentiment-progress-track" aria-hidden="true"><motion.span animate={{ scaleX: step === 0 ? 0 : 1 }} transition={transition} /></div>
        </div>
        <div className="sentiment-output">
          <p className="motion-diagram-label">{step === 3 ? "Priority → evidence" : "Aspect signals"}</p>
          {reviews.map(review => <div className="sentiment-aspect" key={review.aspect}><div><strong>{review.aspect}</strong><span>{step >= 2 ? `1 ${review.sentiment.toLowerCase()}` : "Awaiting summary"}</span></div><div className="sentiment-bar-track" aria-hidden="true"><motion.span data-tone={review.tone} animate={{ scaleX: step >= 2 ? 1 : 0 }} transition={transition} /></div></div>)}
          <motion.div className="sentiment-priority" animate={{ opacity: step === 3 ? 1 : .45 }} transition={transition}><Target size={18} aria-hidden="true" /><div><strong>{step === 3 ? "Inspect delivery feedback" : "A priority needs evidence"}</strong><span>{step === 3 ? "Source: “Giao hàng chậm”" : "Follow the flow to connect the two."}</span></div></motion.div>
        </div>
      </div>}
      <div className="motion-story-narrative" aria-live={playing ? "off" : "polite"} aria-atomic="true">
        <span className="motion-step-number" aria-hidden="true">0{step + 1} / 04</span>
        <AnimatePresence initial={false} mode="wait"><motion.div key={step} initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: reduced ? 1 : 0 }} transition={{ duration: reduced ? 0 : .15 }}><h3>{current.title}</h3><p>{current.description}</p></motion.div></AnimatePresence>
      </div>
    </div>
    <div className="motion-story-controls">
      <div className="motion-story-steps" role="group" aria-label={`${story.name} flow stages`}>{story.steps.map((item, index) => <button type="button" key={item.name} aria-pressed={step === index} onClick={() => selectStep(index)}><span>0{index + 1}</span>{item.name}</button>)}</div>
      <div className="motion-playback" role="group" aria-label="Demonstration playback">
        <button type="button" className="motion-play-button" disabled={reduced} onClick={() => { setPaused(value => !value); }} aria-label={playing ? "Pause flow" : step === 3 ? "Replay flow" : "Play flow"}>{playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}{playing ? "Pause" : step === 3 ? "Replay" : "Play flow"}</button>
        <button type="button" aria-label="Previous stage" disabled={step === 0} onClick={() => selectStep(step - 1)}><ArrowLeft size={16} aria-hidden="true" /></button>
        <button type="button" aria-label="Next stage" disabled={step === 3} onClick={() => selectStep(step + 1)}><ArrowRight size={16} aria-hidden="true" /></button>
        <button type="button" aria-label="Reset demonstration" onClick={() => selectStep(0)}><RotateCcw size={15} aria-hidden="true" /></button>
      </div>
    </div>
    <p className="motion-story-note">{reduced ? "Motion reduced. Choose any stage to explore the flow." : "Plays while in view. Pause or choose a stage to explore at your own pace."} A conceptual visualization using sample data, independent of the original application.</p>
  </section>;
}
