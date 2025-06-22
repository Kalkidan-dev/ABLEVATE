// src/pages/CourseDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { FileText, Volume2, Video, Download, Mic, MicOff, Ear } from 'lucide-react';
import LessonPdfReader from '../components/course/LessonPdfReader';
import { extractTextFromPdf, speakText } from '../utils/pdfReader';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../styles/voiceCommands.css';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [screenReaderOn, setScreenReaderOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const navigate = useNavigate();

  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
  const readFirstPdf = async () => {
    if (screenReaderOn && course?.lessons?.length > 0) {
      const firstLesson = course.lessons.find(lesson => lesson.pdf_file);
      if (firstLesson) {
        const text = await extractTextFromPdf(firstLesson.pdf_file);
        speakText(text.slice(0, 2000)); // Read first 2000 characters
      }
    }
  };
  readFirstPdf();
}, [screenReaderOn, course]);

  useEffect(() => {
    if (!course?.lessons) return;

    const commands = [
      {
        command: 'open *',
        callback: (lessonName) => {
          const match = course.lessons.find((lesson) =>
            lesson.title.toLowerCase().includes(lessonName.toLowerCase())
          );
          if (match) {
            speakText(`Opening lesson: ${match.title}`);
            navigate(`/lessons/${match.id}`);
          } else {
            speakText(`Lesson named ${lessonName} not found`);
          }
        },
      },
      {
        command: 'read titles',
        callback: () => {
          const titles = course.lessons.map((l) => l.title).join(', ');
          speakText(`The lesson titles are: ${titles}`);
        },
      },
      {
        command: 'read summary of *',
        callback: (lessonName) => {
          const match = course.lessons.find((lesson) =>
            lesson.title.toLowerCase().includes(lessonName.toLowerCase())
          );
          if (match) {
            const summary = match.description || 'No description available.';
            speakText(`Summary of ${match.title}: ${summary}`);
          } else {
            speakText(`No lesson called ${lessonName}`);
          }
        },
      },
      {
        command: 'play video of *',
        callback: (lessonName) => {
          const match = course.lessons.find((lesson) =>
            lesson.title.toLowerCase().includes(lessonName.toLowerCase())
          );
          if (match?.video_file) {
            window.open(match.video_file, '_blank');
            speakText(`Opening video for ${match.title}`);
          } else {
            speakText(`No video found for ${lessonName}`);
          }
        },
      },
      {
        command: 'play audio of *',
        callback: (lessonName) => {
          const match = course.lessons.find((lesson) =>
            lesson.title.toLowerCase().includes(lessonName.toLowerCase())
          );
          if (match?.audio_file) {
            window.open(match.audio_file, '_blank');
            speakText(`Opening audio for ${match.title}`);
          } else {
            speakText(`No audio found for ${lessonName}`);
          }
        },
      },
    ];

    SpeechRecognition.startListening({ continuous: true });
    SpeechRecognition.abortListening(); // Reset
    SpeechRecognition.startListening({ continuous: true });
    window.SpeechRecognitionAppCommands = commands; // Optional for debugging

    return () => {
      SpeechRecognition.abortListening();
    };
  }, [course, navigate]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axiosInstance.get(`/courses/${courseId}/`);
        setCourse(res.data);
      } catch (err) {
        console.error('Error fetching course:', err);
      }
    };
    fetchCourse();
  }, [courseId]);

  const toggleMic = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setMicOn(false);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      resetTranscript();
      setMicOn(true);
    }
  };

  const toggleScreenReader = () => {
    setScreenReaderOn((prev) => !prev);
    speakText(`Screen reader ${!screenReaderOn ? 'enabled' : 'disabled'}`);
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support voice commands.</p>;
  }

  if (!course)
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Loading course...
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-6">{course.title}</h1>
      <p className="text-gray-700 text-lg leading-relaxed mb-10">{course.description}</p>

      <h2 className="text-2xl font-semibold text-blue-700 mb-4 border-b border-blue-200 pb-2">
        Lessons
      </h2>

      <div className="grid gap-6">
        {course.lessons?.length > 0 ? (
          course.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="p-5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:shadow-md cursor-pointer transition"
              onClick={() => navigate(`/lessons/${lesson.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/lessons/${lesson.id}`);
              }}
              aria-label={`Lesson: ${lesson.title}`}
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{lesson.title}</h3>
              <p className="text-gray-600 mb-4">
                {lesson.description
                  ? lesson.description.slice(0, 120) +
                    (lesson.description.length > 120 ? '...' : '')
                  : 'No description available.'}
              </p>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {lesson.pdf_file && (
                  <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={lesson.pdf_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <FileText size={18} />
                      View PDF
                    </a>
                    <LessonPdfReader pdfUrl={lesson.pdf_file} />
                  </div>
                )}

                {lesson.audio_file && (
                  <a
                    href={lesson.audio_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Volume2 size={18} />
                    Listen Audio
                  </a>
                )}

                {lesson.video_file && (
                  <a
                    href={lesson.video_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Video size={18} />
                    Watch Video
                  </a>
                )}

                {lesson.downloadable_file && (
                  <a
                    href={lesson.downloadable_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={18} />
                    Download File
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-6">No lessons available yet.</p>
        )}
      </div>

      {/* Floating Mic Button */}
      <button className="voice-mic-button" onClick={toggleMic} title="Toggle Voice Commands">
        {micOn ? <MicOff size={28} /> : <Mic size={28} />}
      </button>

      {/* Transcript Display */}
      {micOn && transcript && (
        <div className="voice-transcript-box">
          <strong>You said:</strong> <br />
          {transcript}
        </div>
      )}

      {/* Screen Reader Toggle */}
      <button className="screen-reader-toggle" onClick={toggleScreenReader}>
        <Ear size={16} className="inline-block mr-1" />
        {screenReaderOn ? 'Disable' : 'Enable'} Screen Reader
      </button>
    </div>
  );
};

export default CourseDetailPage;
