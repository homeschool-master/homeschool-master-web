import type { Student, Task, TaskOwner } from '../types'
import { TASKS_CONTENT } from '../constants/tasks'
import { joinNames } from './profile'
import { fillTemplate } from './grades'

const { ownership } = TASKS_CONTENT

/** First names for the students a task holds, in roster order. */
export const taskStudentNames = (task: Task, students: Student[]): string[] =>
  students
    .filter((student) => task.studentIds.includes(student.id))
    .map((student) => student.firstName)
    .concat(
      // Anyone no longer on the roster still counts: their name is gone, the
      // fact that the task names somebody is not.
      task.studentIds
        .filter((id) => !students.some((student) => student.id === id))
        .map(() => ownership.formerStudent)
    )

/**
 * The line under a task title saying who it involves and whose job it is.
 *
 * Both facts in one phrase rather than two chips, because they only mean
 * anything together: "Eliza" alone does not say whether the teacher is
 * chasing it or Eliza is. Teacher owned work naming nobody says nothing at
 * all, which is what a to-do list has always looked like.
 */
export const ownershipLabel = (task: Task, students: Student[]): string | null => {
  const names = joinNames(taskStudentNames(task, students))

  if (task.ownedBy === 'teacher') {
    return names === '' ? null : fillTemplate(ownership.teacherAbout, { names })
  }

  const template = task.ownedBy === 'both' ? ownership.shared : ownership.student
  return fillTemplate(template, { names })
}

/** The three choices on the form, in the order they are offered. */
export const TASK_OWNERS: TaskOwner[] = ['teacher', 'student', 'both']
