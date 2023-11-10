# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


<!-- LIBS -->
Map --> React leaflet :
`npm i react react-dom leaflet` 
`npm i react-leaflet` 
If typescript :
`npm i D @types/leaflet`
leaflet cluster :
`npm i react-leaflet-cluster` 

Router :
`npm i -D react-router-dom`

Global To do :
    - Maybe add a functionality that remove tank posts of a user that has posted multiples posts in a short period of time. (spaming).
    - Dislay only a given number of posts in CheckPost component (tank page).
    - Delete also some posts from db when their post date is over 7 days. (too old)
    
    LANGAGE:
    - Translate day to arabic. (tank post)
    - Add an authentication for staff (tank responsible/filler) :
    - It can be with a google account (firebase);
    - (For simplicity) a simple id and password, given by us to staff. And allow them to change their password via their mail account.
    --> Pas de possibilité de créer un compte, seulement Se connecter pour les staffs.

    - Handle errors (like internet connection)

- Test on Mobile

    - Handle changing the status of a tank when a post is added.
**04/11/23
To do :
    - Add post by two remaining buttons (Full, halfFull);
    - Handle post date and time;
    - If there is different posts with different days in checkPost, add a component (separator) which shows the day to separate posts in days;
    - update the lastCheck property and display it under the last post (tank page) and in tank box (map page) :
        Each minute, we compare the lastCheck with the actual date time, and update it (in front)
        We do this in the useEffect of the map component and pass the variable to the checkPosts component
********HERE**********
    - When adding a post, refresh directly the lastCheckTime.
    Trying to retrieve setInterval from app.tsx and refresh only concerned components.

    






**01/11/2023
Done : 
- Focus view on map cursor when going back to MapView.
- Set user cookie, and allow posting a new post after the expiration of the cookie.

To do :

Le userId n'affiche pas sa valeur ? Est-ce fait expres ?
    TANK PAGE :
    - The user must not be able to make a new post until 5min from his last post ==> So we have to be able to recognise a user (by his devise ?, maybe when a user add a post, a cookie is created and when a user try to add a post, we retrieve his cookie (if he has) and compare the time posting of that cookie and compare it with the actual time) - Cookie ? LocalStorage ?: 
    when he press on add post, he will get a box telling him that he posted few minutes ago, and he must wait a little bit.
    




**27/10/23
Done :
    - Get tanks from database;
    - Get informations of each tank (lastCheck, latLng(0,1),name, posts(date, status, time, userType));
    - Check position of the user;
    - Make a new post in tank page and display all the posts;

To do :

    MAP PAGE
    - Retrieve infos of tanks from databases (without without giving attention to their types);
    - Display map with all tanks on it;
    - When we click on a tank, we get some informations (name, status, lastCheck (how much time from the last post));
    
    TANK PAGE
        TOP BAR
        - Display tank informations (name, status, status image);
        - Arrow (to got back to map page);

        MAIN SECTION 
 
        - 1:
            - Display all posts wich each one with its infos ( date, time,  status, userType? )
        - 2:
            - Display bottom (Alert/creation post)
                - If user click on it {
                    Another box with some infos (specialy geoloc permission)
                    if user click  on "continu" {
                        
                Geoloc error : i think the navigator.geoloc is running in loop why i dont get neither succes or error console ==> Doesnt work on Opera.
                May be try on mobile.

                        if (geoloc desactivated){
                            Ask to activate
                        }else {
                            - get user geoloc;                      
                            if user geoloc is > tank geoloc (to find the calcul) {
                                - alert("Your are far from the tank, try to come closer to the tank");
                            }else {
                                - display tap waters;
                                When user click on it {
                                    - display a box of confirmation
                                    if user click on "yes" {
                                        - create a new post in db : status, current date, current time, userType, lastCheck;
                                        - update last check for tank / Refresh the MAIN SECTION;
                                    }
                                }
                                
                            }
                        }
                    }
                }
                - Refresh MAIN CONTENT !!!


