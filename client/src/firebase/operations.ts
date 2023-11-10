import React from 'react'
import { DataSnapshot, child, getDatabase, onValue, push, ref, set, update } from "firebase/database";
import { postsProps } from '../pages/MapPage';
import TankStatus from '../models/utils/TankStatus';
 
export const setANewPost = (tankId: number, postData: postsProps) => {
        const db = getDatabase();

        // Get a key for the new post
        const newPostKey = push(child(ref(db), 'tanks/' + tankId + 'posts')).key;
        alert("newPostKey : " + newPostKey);
        // Write the new post's data
        const updates = {
            ['/tanks/' + tankId + '/posts/' + newPostKey] : postData
        };
        

        return update(ref(db), updates)
    }

export const updateLastCheck = (tankId: number, lastCheckTime : number) => {
    const db = getDatabase();
    const updates = {
        ["/tanks/"+tankId+"/lastCheckTime"]: lastCheckTime
    };
    return update(ref(db), updates)
} 

export const updateLastPostTime = (tankId: number, now : number) => {
    const db = getDatabase();
    const updates = {
        ["/tanks/"+tankId+"/lastPostTime"]:now
    };
    return update(ref(db), updates)
}

export const updateTankStatus = (tankId: number, status: TankStatus) => {
    const db = getDatabase()
    console.log("Update tank status :", status)
    const updates = {
        ["/tanks/"+tankId+"/status"]:status
    };
    return update(ref(db), updates)
}