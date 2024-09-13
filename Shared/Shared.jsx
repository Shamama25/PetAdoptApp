import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './../config/FirebaseConfig'

const GetFavList = async (user) => {
    const userDoc = doc(db, 'UserFavPet', user?.primaryEmailAddress?.emailAddress);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        await setDoc(userDoc, {
            email: user?.primaryEmailAddress?.emailAddress,
            favorites: []
        });
        return { email: user?.primaryEmailAddress?.emailAddress, favorites: [] };
    }
}

const UpdateFav = async (user, favorites) => {
    const docRef = doc(db, 'UserFavPet', user?.primaryEmailAddress?.emailAddress);
    try {
        await updateDoc(docRef, {
            favorites: favorites
        })
    } catch (e) {

    }
}
export default {
    GetFavList,
    UpdateFav
}