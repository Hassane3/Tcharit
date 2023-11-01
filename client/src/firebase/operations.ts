import React from 'react'
import { child, getDatabase, push, ref, set, update } from "firebase/database";
import TankStatus from '../models/utils/TankStatus';
import { UserType } from '../models/utils/UsersType';
import { postsProps } from '../pages/MapPage';
 
export const setANewPost = (tankId: number, postData: postsProps) => {
    // const {tankID, status, userType, date, time} = props;
        const db = getDatabase();
        // set(ref(db, 'tanks/' + tankId + 'posts/'), {
        //     status: post.status,
        //     userType: post.userType,
        //     date: post.date,
        //     time: post.time,
        // });

        // Get a key for the new post
        const newPostKey = push(child(ref(db), 'tanks/' + tankId + 'posts')).key;
        alert("newPostKey : " + newPostKey);
        // Write the new post's data
        const updates = {
            ['/tanks/' + tankId + '/posts/' + newPostKey] : postData
        };
        

        return update(ref(db), updates)
    }