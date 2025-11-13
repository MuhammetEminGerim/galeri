import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Contact } from '@/types/car';

const CONTACTS_COLLECTION = 'contacts';

// İletişim formu gönder
export async function submitContact(
  contactData: Omit<Contact, 'id' | 'createdAt'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), {
      ...contactData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting contact:', error);
    throw error;
  }
}

// Tüm mesajları getir (Admin için)
export async function getAllContacts(): Promise<Contact[]> {
  try {
    const contactsRef = collection(db, CONTACTS_COLLECTION);
    const q = query(contactsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email,
      phone: doc.data().phone,
      message: doc.data().message,
      carId: doc.data().carId,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error('Error getting contacts:', error);
    return [];
  }
}
