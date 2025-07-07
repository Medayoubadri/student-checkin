// // hooks/useOptimisticCRUD.ts
// import { useSWRConfig } from "swr";

// interface Student {
//   id: string;
//   name: string;
//   age: number;
//   gender: string;
//   phone: string;
// }

// export function useOptimisticStudents() {
//   const { mutate } = useSWRConfig();

//   const optimisticCreate = async (newStudent: Student) => {
//     mutate(
//       "/api/students",
//       (current: Student[] | undefined) =>
//         current ? [...current, newStudent] : [newStudent],
//       false
//     );
//     return newStudent;
//   };

//   const optimisticDelete = (studentId: string) => {
//     mutate(
//       "/api/students",
//       (current: Student[] | undefined) =>
//         current ? current.filter((s) => s.id !== studentId) : [],
//       false
//     );
//   };

//   const optimisticUpdate = (updatedStudent: Student) => {
//     mutate(
//       "/api/students",
//       (current: Student[] | undefined) =>
//         current
//           ? current.map((s) =>
//               s.id === updatedStudent.id ? updatedStudent : s
//             )
//           : [],
//       false
//     );
//   };

//   return { optimisticCreate, optimisticDelete, optimisticUpdate };
// }
