import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { sendSmartNotification } from '../utils/pushNotifications';

interface NotificationData {
  title: string;
  message: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  type: 'bill' | 'task' | 'package' | 'password' | 'budget' | 'general';
  relatedId?: string;
  read: boolean;
}

export const useNotifications = () => {
  
  const createNotification = async (userId: string, notification: NotificationData) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        ...notification,
        createdAt: new Date().toISOString(),
        read: false
      });
      console.log('📬 Notification created:', notification.title);
      
      // Send browser push notification for High/Urgent priority
      sendSmartNotification(
        notification.title,
        notification.message,
        notification.priority,
        notification.type
      );
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const checkBillDueNotifications = async (userId: string, bills: any[]) => {
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    for (const bill of bills) {
      if (!bill.dueDate || bill.paid) continue;
      
      const dueDate = new Date(bill.dueDate);
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      // Check if notification already exists for this bill
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('relatedId', '==', bill.id),
        where('type', '==', 'bill')
      );
      const existing = await getDocs(q);
      
      if (existing.empty) {
        // Bill due in 3 days or less
        if (daysUntilDue <= 3 && daysUntilDue >= 0) {
          await createNotification(userId, {
            title: `Bill Due ${daysUntilDue === 0 ? 'Today' : `in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`}`,
            message: `${bill.name} - $${bill.amount.toFixed(2)} is due on ${dueDate.toLocaleDateString()}`,
            priority: daysUntilDue === 0 ? 'Urgent' : daysUntilDue === 1 ? 'High' : 'Medium',
            type: 'bill',
            relatedId: bill.id,
            read: false
          });
        }
        // Bill overdue
        else if (daysUntilDue < 0) {
          await createNotification(userId, {
            title: '⚠️ Overdue Bill',
            message: `${bill.name} - $${bill.amount.toFixed(2)} was due on ${dueDate.toLocaleDateString()}`,
            priority: 'Urgent',
            type: 'bill',
            relatedId: bill.id,
            read: false
          });
        }
      }
    }
  };

  const checkTaskDueNotifications = async (userId: string, tasks: any[]) => {
    const today = new Date();
    
    for (const task of tasks) {
      if (!task.dueDate || task.completed) continue;
      
      const dueDate = new Date(task.dueDate);
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      // Check if notification already exists
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('relatedId', '==', task.id),
        where('type', '==', 'task')
      );
      const existing = await getDocs(q);
      
      if (existing.empty) {
        // Task due today
        if (daysUntilDue === 0) {
          await createNotification(userId, {
            title: '📋 Task Due Today',
            message: `"${task.title}" is due today`,
            priority: 'High',
            type: 'task',
            relatedId: task.id,
            read: false
          });
        }
        // Task overdue
        else if (daysUntilDue < 0) {
          await createNotification(userId, {
            title: '⚠️ Overdue Task',
            message: `"${task.title}" was due on ${dueDate.toLocaleDateString()}`,
            priority: 'Urgent',
            type: 'task',
            relatedId: task.id,
            read: false
          });
        }
      }
    }
  };

  const checkPasswordExpirationNotifications = async (userId: string, passwords: any[]) => {
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    for (const password of passwords) {
      if (!password.expiresAt) continue;
      
      const expiryDate = new Date(password.expiresAt);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      // Check if notification already exists
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('relatedId', '==', password.id),
        where('type', '==', 'password')
      );
      const existing = await getDocs(q);
      
      if (existing.empty) {
        // Password expires in 7 days or less
        if (daysUntilExpiry <= 7 && daysUntilExpiry >= 0) {
          await createNotification(userId, {
            title: '🔐 Password Expiring Soon',
            message: `Password for "${password.service}" expires ${daysUntilExpiry === 0 ? 'today' : `in ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''}`}`,
            priority: daysUntilExpiry <= 1 ? 'High' : 'Medium',
            type: 'password',
            relatedId: password.id,
            read: false
          });
        }
        // Password expired
        else if (daysUntilExpiry < 0) {
          await createNotification(userId, {
            title: '⚠️ Password Expired',
            message: `Password for "${password.service}" expired on ${expiryDate.toLocaleDateString()}`,
            priority: 'High',
            type: 'password',
            relatedId: password.id,
            read: false
          });
        }
      }
    }
  };

  const checkPackageDeliveredNotifications = async (userId: string, packages: any[]) => {
    for (const pkg of packages) {
      if (pkg.status !== 'Delivered') continue;
      
      // Check if notification already exists
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('relatedId', '==', pkg.id),
        where('type', '==', 'package')
      );
      const existing = await getDocs(q);
      
      if (existing.empty) {
        await createNotification(userId, {
          title: '📦 Package Delivered',
          message: `"${pkg.description}" has been delivered!`,
          priority: 'Medium',
          type: 'package',
          relatedId: pkg.id,
          read: false
        });
      }
    }
  };

  const checkBudgetWarningNotifications = async (userId: string, budget: any, expenses: any[]) => {
    if (!budget || !budget.monthlyBudget) return;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
    
    const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const percentUsed = (totalSpent / budget.monthlyBudget) * 100;
    
    // Check if notification already exists for this month
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('type', '==', 'budget')
    );
    const existing = await getDocs(q);
    const thisMonthNotif = existing.docs.find(doc => {
      const created = new Date(doc.data().createdAt);
      return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
    });
    
    if (!thisMonthNotif) {
      if (percentUsed >= 100) {
        await createNotification(userId, {
          title: '💰 Budget Exceeded!',
          message: `You've spent $${totalSpent.toFixed(2)} of your $${budget.monthlyBudget.toFixed(2)} monthly budget (${percentUsed.toFixed(0)}%)`,
          priority: 'Urgent',
          type: 'budget',
          read: false
        });
      } else if (percentUsed >= 80) {
        await createNotification(userId, {
          title: '⚠️ Budget Warning',
          message: `You've used ${percentUsed.toFixed(0)}% of your monthly budget`,
          priority: 'High',
          type: 'budget',
          read: false
        });
      }
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async (userId: string) => {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      );
      const snapshot = await getDocs(q);
      
      const promises = snapshot.docs.map(doc => 
        updateDoc(doc.ref, { read: true })
      );
      
      await Promise.all(promises);
      console.log(`✅ Marked ${promises.length} notifications as read`);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return {
    createNotification,
    checkBillDueNotifications,
    checkTaskDueNotifications,
    checkPasswordExpirationNotifications,
    checkPackageDeliveredNotifications,
    checkBudgetWarningNotifications,
    markAsRead,
    markAllAsRead
  };
};

