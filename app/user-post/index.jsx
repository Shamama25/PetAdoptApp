import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { db } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { query, collection, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import PetListItem from './../../components/Home/PetListItem';
import Colors from '../../constants/Colors';

export default function UserPost() {
    const navigation = useNavigation();
    const { user } = useUser();
    const [userPostList, setUserPostList] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'User Post'
        });
        if (user) {
            console.log("User email:", user.primaryEmailAddress?.emailAddress);
            GetUserPost();
        }
    }, [user]);

    const GetUserPost = async () => {
        setLoader(true);
        try {
            const userEmail = user?.primaryEmailAddress?.emailAddress;
            if (!userEmail) {
                console.error("User email is not available");
                setLoader(false);
                return;
            }

            const q = query(collection(db, 'Pets'), where('email', '==', userEmail));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log("No matching documents.");
                setUserPostList([]);
            } else {
                const posts = [];
                querySnapshot.forEach((doc) => {
                    console.log("Document data:", doc.data());
                    posts.push({ id: doc.id, ...doc.data() });
                });
                setUserPostList(posts);
            }
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
        setLoader(false);
    };

    const onDeletePost = (docId) => {
        Alert.alert(
            "Do you want to delete?",
            "Are you sure you want to delete this post?",
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log("Cancel Clicked"),
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: () => deletePost(docId)
                }
            ]
        );
    };

    const deletePost = async (docId) => {
        await deleteDoc(doc(db, 'Pets', docId));
        GetUserPost();
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontFamily: 'outfitMedium', fontSize: 30 }}>UserPost</Text>
            <FlatList
                data={userPostList}
                numColumns={2}
                refreshing={loader}
                onRefresh={GetUserPost}
                renderItem={({ item, index }) => (
                    <View key={index}>
                        <PetListItem pet={item} />
                        <TouchableOpacity style={styles.deleteButton} onPress={() => onDeletePost(item?.id)}>
                            <Text style={{ fontFamily: 'outfit', textAlign: 'center' }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            {userPostList.length === 0 && <Text>No post found</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    deleteButton: {
        backgroundColor: Colors.SECONDARY,
        padding: 5,
        borderRadius: 7,
        marginTop: 5,
        marginRight: 10,
    }
});