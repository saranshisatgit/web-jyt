import React from 'react';
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
// Slide props injected via FeatureCarousel
interface TasksListSlideProps {
  title?: string;
  description?: string | string[];
}

/**
 * Slide 2: Tasks & Designs
 */
export default function TasksListSlide({
  title = 'Tasks & Designs',
  description = 'Track your tasks and see which designs are pending or completed.',
}: TasksListSlideProps) {
  const tasks = [
    { id: '1', title: 'Design Garment A', status: 'completed' },
    { id: '2', title: 'Design Garment B', status: 'pending' },
    { id: '3', title: 'Review Sketches', status: 'completed' },
    { id: '4', title: 'Finalize Patterns', status: 'pending' },
  ];
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="flex flex-col md:flex-row items-start justify-center gap-8 h-full relative">
      <div className="w-full md:w-1/2 pt-16">
        <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
        {Array.isArray(description) ? (
          <ul className="list-disc pl-5 mb-4 space-y-2">
            {description.map((d, idx) => (
              <li key={idx} className="text-base text-gray-600 dark:text-gray-300">{d}</li>
            ))}
          </ul>
        ) : (
          <p className="text-base text-gray-600 dark:text-gray-300 mb-2">{description}</p>
        )}
      </div>
      <div className="-m-2 grid grid-cols-1 rounded-4xl ring-1 shadow-[inset_0_0_2px_1px_#ffffff4d] ring-black/5 max-lg:mx-auto max-lg:max-w-md self-end relative mt-4 md:mt-16 overflow-visible">
        <div className="grid grid-cols-1 rounded-4xl p-2 shadow-md shadow-black/5">
          <div className="rounded-3xl bg-white p-10 ring-1 shadow-2xl ring-black/5">
            <ul className="space-y-4 w-full">
              {pendingTasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between p-4 bg-yellow-100 rounded-2xl">
                  <span className="font-medium text-gray-800">{task.title}</span>
                  <ClockIcon className="h-6 w-6 text-gray-500" />
                </li>
              ))}
              {completedTasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between p-4 bg-green-100 rounded-2xl">
                  <span className="font-medium text-gray-800 line-through">{task.title}</span>
                  <CheckIcon className="h-6 w-6 text-green-500" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
