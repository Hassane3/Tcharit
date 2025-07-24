import { postsProps, tankDataProps } from '../pages/MapPage';
import TankStatus from '../models/utils/TankStatus';
import { child, getDatabase, push, ref, remove, set, update } from "firebase/database";
import {  getAuth, signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';
 


export const setANewCistern = (tankId:number,tankData:tankDataProps) :Promise<void>=>{
    
        const db = getDatabase();
        const updates = {
            ['tanks/'+tankId]: tankData
        };
      return update(ref(db), updates)
}

export const setANewPost = (tankId: number, postData: postsProps) :Promise<void>=> {

        const db = getDatabase();

        // Get a key for the new post
        const newPostKey = push(child(ref(db), 'tanks/' + tankId + 'posts')).key;
        // Write the new post's data
        const updates = {
            ['/tanks/' + tankId + '/posts/' + newPostKey] : postData
        };

        return update(ref(db), updates)
    }

export const deletePost = (tankId: number, postKey?:number) => {
    const db = getDatabase();

    remove(ref(db, "tanks/" + tankId + "/posts/" + postKey)).then((onfulfilled)=> onfulfilled ).catch((error)=>  error);
}
export const deleteTank = (tankId: number) => {
    const db = getDatabase();
    remove(ref(db, "tanks/" + tankId )).then((onfulfilled)=> onfulfilled ).catch((error)=>  error);
}

export const updateLastCheck = (tankId: number, lastCheckTime : number) => {
    const db = getDatabase();
    const updates = {
        ["/tanks/"+tankId+"/lastCheckTime"]:lastCheckTime
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
export const updateCisternlastTimeFilled = (tankId: number, lastTimeFilled : number) => {
    const db = getDatabase();
    const updates = {
        ["/tanks/"+tankId+"/lastTimeFilled"]: lastTimeFilled
    };
    return update(ref(db), updates)
} 

export const tankAgentSignInn = (email: string, password: string) => {
    const db = getDatabase()
    // Initialize Firebase Authentication and get a reference to the service
    const auth = getAuth(db.app);
    signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("Signed in user:", user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("Error connection db > ",errorCode," ", errorMessage)
    // ..
  });
}

export const tankAgentSignIn:(email:string, password: string)=> Promise<UserCredential> = (email, password)=>{
    const promise = new Promise<UserCredential> ((resolve) =>{

        const db = getDatabase()
        // Initialize Firebase Authentication and get a reference to the service
        const auth = getAuth(db.app);
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        
        console.log("Signed in user:", user);
        resolve(userCredential);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error connection db > ",errorCode," ", errorMessage)
        resolve(error);
      });
      
    })

    return promise
}
export const logoutUser = ( ) => {
    const db = getDatabase()
    const auth = getAuth(db.app)
    signOut(auth).then(()=>{
        console.log("User logged out")
        }).catch((error)=>{
            console.log("Error logging out user > ", error)
        })
        
}
