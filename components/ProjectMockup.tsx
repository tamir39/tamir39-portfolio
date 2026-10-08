"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, BookOpen, Check, CheckCircle2, GraduationCap, Heart, Leaf, RotateCcw, Sprout } from "lucide-react";
import { mockupNames, sampleFlashcards, sampleLearners, sampleLessons, sampleRoutines } from "@/lib/data/mockups";

function Progress({ value, label }: { value: number; label: string }) {
  return <div className="mock-progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)}><span style={{ width: `${value}%` }} /></div>;
}

function SelfNestMockup() {
  const [mood, setMood] = useState<string | null>(null);
  const [completed, setCompleted] = useState([true, false, false]);
  const [view, setView] = useState("Today");
  const [message, setMessage] = useState("");
  const total = completed.filter(Boolean).length;

  function toggleRoutine(index: number) {
    setCompleted(items => items.map((done, itemIndex) => itemIndex === index ? !done : done));
    setMessage(`${sampleRoutines[index]} ${completed[index] ? "marked as not yet done" : "completed"}.`);
  }

  function reset() {
    setMood(null); setCompleted([true, false, false]); setView("Today"); setMessage("SelfNest preview reset.");
  }

  return <div className="mock-app mock-selfnest">
    <div className="mock-app-header"><span className="mock-brand"><Sprout size={18} aria-hidden="true" />SelfNest</span><button type="button" className="mock-icon-button" onClick={reset} aria-label="Reset SelfNest mockup"><RotateCcw size={15} aria-hidden="true" /></button></div>
    <div className="mock-view-switch" role="group" aria-label="SelfNest preview view">{["Today", "Routines"].map(item => <button key={item} type="button" aria-pressed={view === item} onClick={() => setView(item)}>{item}</button>)}</div>
    <div className="mock-content">
      <div className="mock-greeting"><div><p className="mock-eyebrow">YOUR DAILY LANDING PLACE</p><p className="mock-title">A fresh start,<br />at your pace.</p></div><Leaf size={40} strokeWidth={1.3} aria-hidden="true" /></div>
      {view === "Today" && <fieldset className="mock-checkin"><legend><Heart size={14} aria-hidden="true" />How are you, really?</legend><div className="mock-moods">{["Low", "Okay", "Good"].map(item => <button key={item} type="button" aria-pressed={mood === item} onClick={() => { setMood(item); setMessage(`Preview check-in: ${item}.`); }}>{mood === item && <Check size={12} aria-hidden="true" />}{item}</button>)}</div><p className="mock-muted">A quiet minute, just for you.</p></fieldset>}
      <div className="mock-section-title"><p>Your daily rhythm</p><span>{total}/{sampleRoutines.length}</span></div>
      <Progress value={total / sampleRoutines.length * 100} label="Sample routine completion" />
      <div className="mock-routines">{sampleRoutines.map((routine, index) => <label key={routine} className="mock-routine"><input type="checkbox" checked={completed[index]} onChange={() => toggleRoutine(index)} /><span className="mock-check" aria-hidden="true">{completed[index] && <Check size={13} />}</span><span className={completed[index] ? "mock-completed" : ""}>{routine}</span></label>)}</div>
      {view === "Routines" && <p className="mock-gentle-note">You don’t have to do everything today. A small step still counts.</p>}
    </div>
    <p role="status" className="mock-feedback">{message || "Try a check-in or complete a routine."}</p>
  </div>;
}

function EnStudyMockup() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState("");
  const card = sampleFlashcards[index];
  const finished = index === sampleFlashcards.length;
  const answerId = useId();
  const cardRef = useRef<HTMLButtonElement>(null);
  const restartRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    if (restoreFocus.current) {
      (finished ? restartRef.current : cardRef.current)?.focus();
      restoreFocus.current = false;
    }
  }, [index, finished]);

  function reset() { restoreFocus.current = true; setIndex(0); setRevealed(false); setMessage("EnStudy-Hub preview reset."); }

  function rate(rating: string) {
    const nextIndex = index + 1;
    restoreFocus.current = true;
    setIndex(nextIndex); setRevealed(false);
    setMessage(nextIndex === sampleFlashcards.length ? "All three sample cards reviewed." : `Rated ${rating}. Next word: ${sampleFlashcards[nextIndex].word}.`);
  }

  return <div className="mock-app mock-enstudy">
    <div className="mock-app-header"><span className="mock-brand"><BookOpen size={18} aria-hidden="true" />EnStudy-Hub</span><button type="button" className="mock-icon-button" onClick={reset} aria-label="Reset EnStudy-Hub mockup"><RotateCcw size={15} aria-hidden="true" /></button></div>
    <div className="mock-content">
      <div className="mock-section-title"><p>Daily review</p><span>{index}/{sampleFlashcards.length} reviewed</span></div>
      <Progress value={index / sampleFlashcards.length * 100} label="Sample vocabulary review progress" />
      {!finished ? <>
        <button ref={cardRef} type="button" className="mock-flashcard" aria-pressed={revealed} aria-describedby={revealed ? answerId : undefined} aria-label={`${revealed ? "Hide" : "Reveal"} meaning of ${card.word}`} onClick={() => setRevealed(value => !value)}>
          <span className="mock-card-kicker"><span className="mock-word-chip">New word</span><span>{card.part}</span></span>
          <span className="mock-word">{card.word}</span><span className="mock-ipa">{card.ipa}</span>
          {revealed ? <span id={answerId} className="mock-answer"><strong lang="vi">{card.meaning}</strong><span>{card.definition}</span><em>{card.example}</em></span> : <span className="mock-reveal-hint">Click or press Space to reveal<ArrowRight size={15} aria-hidden="true" /></span>}
        </button>
        <p className="mock-rating-label">{revealed ? "How well did you remember?" : "Reveal the meaning to rate this card."}</p>
        <div className="mock-ratings">{["Again", "Hard", "Good", "Easy"].map(rating => <button key={rating} type="button" className={`mock-rate mock-rate-${rating.toLowerCase()}`} disabled={!revealed} onClick={() => rate(rating)}>{rating}</button>)}</div>
      </> : <div className="mock-finished"><CheckCircle2 size={34} aria-hidden="true" /><p className="mock-title">A little more learned.</p><p>All {sampleFlashcards.length} sample words reviewed.</p><button ref={restartRef} type="button" className="mock-primary" onClick={reset}>Try again<RotateCcw size={15} aria-hidden="true" /></button></div>}
    </div>
    <p role="status" className="mock-feedback">{message || "Try revealing and rating a flashcard."}</p>
  </div>;
}

function EducataMockup() {
  const [role, setRole] = useState("Student");
  const [lesson, setLesson] = useState(1);
  const [completed, setCompleted] = useState([true, false, false]);
  const [published, setPublished] = useState(false);
  const [activeUsers, setActiveUsers] = useState([true, true]);
  const [message, setMessage] = useState("");
  const count = completed.filter(Boolean).length;

  function reset() {
    setRole("Student"); setLesson(1); setCompleted([true, false, false]); setPublished(false); setActiveUsers([true, true]); setMessage("Educata preview reset.");
  }

  function completeLesson() {
    setCompleted(items => items.map((done, index) => index === lesson ? !done : done));
    setMessage(`${sampleLessons[lesson].title} ${completed[lesson] ? "marked incomplete" : "completed"}.`);
  }

  return <div className="mock-app mock-educata">
    <div className="mock-app-header"><span className="mock-brand"><GraduationCap size={20} aria-hidden="true" />Educata</span><button type="button" className="mock-icon-button" onClick={reset} aria-label="Reset Educata mockup"><RotateCcw size={15} aria-hidden="true" /></button></div>
    <div className="mock-view-switch" role="group" aria-label="Educata preview role">{["Student", "Teacher", "Admin"].map(item => <button key={item} type="button" aria-pressed={role === item} onClick={() => { setRole(item); setMessage(`${item} workspace selected.`); }}>{item}</button>)}</div>
    <div className="mock-content">
      <p className="mock-eyebrow">{role.toUpperCase()} WORKSPACE</p>
      {role === "Student" ? <>
        <p className="mock-title">Interface design</p>
        <p className="mock-course-summary">{count} of {sampleLessons.length} lessons complete</p>
        <Progress value={count / sampleLessons.length * 100} label="Sample course completion" />
        <div className="mock-lessons" role="group" aria-label="Sample course lessons">{sampleLessons.map((item, index) => <button type="button" key={item.title} aria-pressed={lesson === index} onClick={() => setLesson(index)}><span className="mock-lesson-number">{completed[index] ? <Check size={13} aria-hidden="true" /> : index + 1}</span>{item.title}{completed[index] && <span className="sr-only"> · Completed</span>}<span className="mock-lesson-current" aria-hidden="true">{lesson === index && <ArrowRight size={14} />}</span></button>)}</div>
        <p className="mock-lesson-detail">{sampleLessons[lesson].detail}</p>
        <button type="button" className="mock-primary" onClick={completeLesson}>{completed[lesson] ? "Undo completion" : "Complete lesson"}{completed[lesson] ? <RotateCcw size={14} aria-hidden="true" /> : <Check size={14} aria-hidden="true" />}</button>
        {count === sampleLessons.length && <p className="mock-success"><CheckCircle2 size={15} aria-hidden="true" />Course complete</p>}
      </> : role === "Teacher" ? <>
        <p className="mock-title">A place to teach.<br />Room to grow.</p>
        <div className="mock-stat-grid"><div><strong>1</strong><span>Course</span></div><div><strong>3</strong><span>Lessons</span></div><div><strong>12</strong><span>Learners</span></div></div>
        <div className="mock-teacher-course"><div className="mock-section-title"><p>Interface design</p><span className="mock-state-chip">{published ? "Published" : "Draft"}</span></div><p>Three lessons, one clear learning journey.</p><button type="button" className="mock-primary" onClick={() => { setPublished(value => !value); setMessage(published ? "Sample course returned to draft." : "Sample course published in this preview."); }}>{published ? "Return to draft" : "Publish sample course"}<ArrowRight size={14} aria-hidden="true" /></button></div>
      </> : <>
        <p className="mock-title">The right access.<br />A clearer workspace.</p>
        <div className="mock-stat-grid"><div><strong>2</strong><span>Users</span></div><div><strong>{activeUsers.filter(Boolean).length}</strong><span>Active</span></div></div>
        <div className="mock-users">{sampleLearners.map((user, index) => <div key={user}><span><strong>{user}</strong><small>{activeUsers[index] ? "Active" : "Inactive"}</small></span><button type="button" onClick={() => { setActiveUsers(users => users.map((active, itemIndex) => itemIndex === index ? !active : active)); setMessage(`${user} ${activeUsers[index] ? "deactivated" : "activated"} in this preview.`); }}>{activeUsers[index] ? "Deactivate" : "Activate"}<span className="sr-only"> {user}</span></button></div>)}</div>
      </>}
    </div>
    <p role="status" className="mock-feedback">{message || "Try a lesson or switch workspace roles."}</p>
  </div>;
}

export function ProjectMockup({ slug, detail = false }: { slug: string; detail?: boolean }) {
  const name = mockupNames[slug];
  if (!name) return null;
  return <div className={`project-mockup${detail ? " project-mockup-detail" : ""}`} role="region" aria-label={`${name} interactive mockup`}>
    <div className="mock-window-bar"><span className="mock-window-dots" aria-hidden="true"><i /><i /><i /></span><span>Interactive mockup</span><span className="mock-sample-label">Sample data</span></div>
    {slug === "selfnest" ? <SelfNestMockup /> : slug === "enstudy-hub" ? <EnStudyMockup /> : <EducataMockup />}
    <p className="mock-disclaimer">Portfolio preview · sample changes reset on reload.</p>
  </div>;
}
