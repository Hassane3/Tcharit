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


**27/10/23
Done :
    - Get tanks from database
    - Get informations of each tank (lastCheck, latLng(0,1),  name, posts(date, status, time, userType))

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
            ///////HERE//////////////
                Geoloc error : i think the navigator.geoloc is running in loop why i dont get neither succes or error console.
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
                                        - create a new post in db and send this info to server;
                                        - update last check for tank / Refresh the MAIN SECTION;
                                    }
                                }
                                
                            }
                        }
                    }
                }
                - Refresh MAIN CONTENT !!!


