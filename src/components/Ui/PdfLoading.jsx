import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function PdfLoading() {
  const [steps, setSteps] = useState([]);
  const [visible, setVisible] = useState(true);
  const timeouts = useRef([]);
  const countdownInterval = useRef(null);
  const idCounter = useRef(0);

  useEffect(() => {
    // timeline for steps (ms)
    const timeline = [
      { delay: 0, msg: "Fetching PDF from database..." },
      { delay: 3000, msg: "✅ PDF fetched successfully" },
      { delay: 4000, msg: "Starting worker to render PDF..." },
      { delay: 6000, msg: "✅ Worker started successfully" },
      { delay: 7000, msg: "countdown" }, // trigger countdown
    ];

    timeline.forEach(({ delay, msg }) => {
      const t = setTimeout(() => {
        if (msg === "countdown") {
          startCountdown();
        } else {
          setSteps((prev) => [
            ...prev,
            { id: nextId(), text: msg },
          ]);
        }
      }, delay);
      timeouts.current.push(t);
    });

    // make loader disappear after 10s
    const hideTimeout = setTimeout(() => {
      setVisible(false);
    }, 10000);
    timeouts.current.push(hideTimeout);

    return () => {
      // cleanup timeouts & interval on unmount
      timeouts.current.forEach((t) => clearTimeout(t));
      timeouts.current = [];
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
        countdownInterval.current = null;
      }
    };
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function nextId() {
    idCounter.current += 1;
    return `step-${Date.now()}-${idCounter.current}`;
  }

  function startCountdown() {
    let c = 3;
    // append initial countdown line
    setSteps((prev) => [...prev, { id: nextId(), text: `Showing PDF in ${c}...` }]);

    countdownInterval.current = setInterval(() => {
      c -= 1;
      setSteps((prev) => {
        const copy = [...prev];
        // replace last entry (countdown line) with updated value
        if (copy.length === 0) return copy;
        if (c === 0) {
          copy[copy.length - 1] = { id: nextId(), text: "✅ PDF Ready!" };
          clearInterval(countdownInterval.current);
          countdownInterval.current = null;
        } else {
          copy[copy.length - 1] = { id: nextId(), text: `Showing PDF in ${c}...` };
        }
        return copy;
      });
    }, 1000);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35 }}
          className="w-screen h-screen flex flex-col items-start justify-center bg-gray-900 text-white font-mono px-6"
        >
          <div className="max-w-2xl">
            {steps.map(({ text, id }) => (
              <motion.p
                key={id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="mb-2 text-base"
              >
                {text}
              </motion.p>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PdfLoading;
