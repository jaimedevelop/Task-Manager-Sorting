import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Task } from '../types/Task';

const TASKS_COLLECTION = 'tasks';
const TASK_TYPES_COLLECTION = 'taskTypes';

// Convert Firestore document to Task object
const convertFirestoreTask = (doc: any): Task => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    priority: data.priority,
    type: data.type || 'General', // Default type for existing tasks
    completed: data.completed,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
};

// Convert Task object to Firestore document
const convertTaskToFirestore = (task: Omit<Task, 'id'>) => {
  return {
    title: task.title,
    description: task.description,
    priority: task.priority,
    type: task.type,
    completed: task.completed,
    createdAt: Timestamp.fromDate(task.createdAt),
    updatedAt: Timestamp.fromDate(task.updatedAt),
  };
};

export const taskService = {
  // Create a new task
  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      console.log('Creating task:', taskData);
      const now = new Date();
      const task = {
        ...taskData,
        createdAt: now,
        updatedAt: now,
      };
      
      const firestoreData = convertTaskToFirestore(task);
      console.log('Firestore data:', firestoreData);
      
      const docRef = await addDoc(collection(db, TASKS_COLLECTION), firestoreData);
      console.log('Task created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating task:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create task: ${error.message}`);
      }
      throw new Error('Failed to create task');
    }
  },

  // Update an existing task
  async updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<void> {
    try {
      console.log('Updating task:', id, updates);
      const taskRef = doc(db, TASKS_COLLECTION, id);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      };
      
      await updateDoc(taskRef, updateData);
      console.log('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to update task: ${error.message}`);
      }
      throw new Error('Failed to update task');
    }
  },

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    try {
      console.log('Deleting task:', id);
      const taskRef = doc(db, TASKS_COLLECTION, id);
      await deleteDoc(taskRef);
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to delete task: ${error.message}`);
      }
      throw new Error('Failed to delete task');
    }
  },

  // Get all tasks (one-time fetch)
  async getTasks(): Promise<Task[]> {
    try {
      console.log('Fetching tasks...');
      const q = query(collection(db, TASKS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const tasks = querySnapshot.docs.map(convertFirestoreTask);
      console.log('Fetched tasks:', tasks);
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch tasks: ${error.message}`);
      }
      throw new Error('Failed to fetch tasks');
    }
  },

  // Subscribe to real-time task updates
  subscribeToTasks(
    callback: (tasks: Task[]) => void,
    errorCallback?: (error: string) => void
  ): () => void {
    try {
      console.log('Setting up task subscription...');
      const q = query(collection(db, TASKS_COLLECTION), orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(
        q, 
        (querySnapshot: QuerySnapshot<DocumentData>) => {
          console.log('Received task update from Firestore, docs count:', querySnapshot.docs.length);
          
          try {
            const tasks = querySnapshot.docs.map((doc) => {
              console.log('Processing doc:', doc.id, doc.data());
              return convertFirestoreTask(doc);
            });
            
            console.log('Converted tasks:', tasks);
            callback(tasks);
          } catch (conversionError) {
            console.error('Error converting Firestore documents:', conversionError);
            if (errorCallback) {
              errorCallback('Failed to process task data');
            }
          }
        }, 
        (error) => {
          console.error('Error in task subscription:', error);
          const errorMessage = error.message || 'Unknown subscription error';
          if (errorCallback) {
            errorCallback(errorMessage);
          } else {
            // Fallback: call callback with empty array to stop loading state
            callback([]);
          }
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up task subscription:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to subscribe to tasks';
      if (errorCallback) {
        errorCallback(errorMessage);
      }
      
      // Return a no-op function
      return () => {};
    }
  },

  // Test connection to Firestore
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Firestore connection...');
      const q = query(collection(db, TASKS_COLLECTION));
      const querySnapshot = await getDocs(q);
      console.log('Firestore connection successful, found', querySnapshot.docs.length, 'documents');
      return true;
    } catch (error) {
      console.error('Firestore connection failed:', error);
      return false;
    }
  },

  // Task Types Management
  async getTaskTypes(): Promise<string[]> {
    try {
      console.log('Fetching task types...');
      const querySnapshot = await getDocs(collection(db, TASK_TYPES_COLLECTION));
      const types = querySnapshot.docs.map(doc => doc.data().name);
      
      // Always include default types
      const defaultTypes = ['General', 'Work', 'Personal', 'Shopping'];
      const allTypes = [...new Set([...defaultTypes, ...types])];
      
      console.log('Fetched task types:', allTypes);
      return allTypes.sort();
    } catch (error) {
      console.error('Error fetching task types:', error);
      // Return default types if fetch fails
      return ['General', 'Work', 'Personal', 'Shopping'];
    }
  },

  async createTaskType(typeName: string): Promise<void> {
    try {
      console.log('Creating task type:', typeName);
      await addDoc(collection(db, TASK_TYPES_COLLECTION), {
        name: typeName,
        createdAt: Timestamp.fromDate(new Date()),
      });
      console.log('Task type created successfully');
    } catch (error) {
      console.error('Error creating task type:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create task type: ${error.message}`);
      }
      throw new Error('Failed to create task type');
    }
  },

  subscribeToTaskTypes(
    callback: (types: string[]) => void,
    errorCallback?: (error: string) => void
  ): () => void {
    try {
      console.log('Setting up task types subscription...');
      
      const unsubscribe = onSnapshot(
        collection(db, TASK_TYPES_COLLECTION),
        (querySnapshot) => {
          try {
            const types = querySnapshot.docs.map(doc => doc.data().name);
            const defaultTypes = ['General', 'Work', 'Personal', 'Shopping'];
            const allTypes = [...new Set([...defaultTypes, ...types])];
            callback(allTypes.sort());
          } catch (conversionError) {
            console.error('Error converting task types:', conversionError);
            if (errorCallback) {
              errorCallback('Failed to process task types');
            }
          }
        },
        (error) => {
          console.error('Error in task types subscription:', error);
          if (errorCallback) {
            errorCallback(error.message);
          }
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up task types subscription:', error);
      if (errorCallback) {
        errorCallback(error instanceof Error ? error.message : 'Failed to subscribe to task types');
      }
      return () => {};
    }
  }
};