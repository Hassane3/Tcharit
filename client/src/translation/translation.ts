export type TranslationObjType = {
    appname : string;
    common: Common;
    navigation: Navigation;
    menu: Menu;
    account: Account;
    contact: Contact;
    errors: Errors;
    day: Day;
    month: Month;
    languages: Languages;
}
export interface Account {
    email: string;
    confirmEmail: string;
    firstname: string;
    lastname: string;
    password: string;
    confirmpassword: string;
    phoneNumber: string;
    address: string;
    restauranthours: string;
    age: string;
    continue: string;
    save: string;
    signup: string;
    signin: string;
    logout: string;
    updateaccount: string;
    cardnumber: string;
    expirationdate: string;
    visualcrypto: string;
    country: string;
    accountcreated: string;
    accountupdated: string;
    forgotpasswordtitle: string;
    forgotpassworddesc: string;
    resetpassworddesc: string;
    forgotpassword: string;
    resetpassword: string;
    missinglink: string;
    welcome: string;
    getstarted: string;
    noaccount: string;
    haveaccount: string;
    verificationlink: string;
    verificationlinknotice: string;
    userDisabled: string;
    userDisabledNotice: string;
  }
export interface Common {
    yes: string,
    no: string,
    cancel: string,
    ok: string,
    save: string,
    load: string,
    delete: string,
    edit: string,
    add: string,
    back: string,
    next: string,
    previous: string,
    search: string,
    close: string,
}
export interface Contact {
    contact: string;
    subject: string;
  }

  export interface Day {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  }
  export interface Errors {
    unexpectederroroccurred: string;
    connfailed: string;
    somethingwrong: string;
    tryagain: string;
    geolocunavailable: string;
    
  }
  export interface Languages {
    fr: string;
    en: string;
    ar: string;
  }
   
  export interface Menu {
 
  }
  export interface Month {
    january: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
  }
  export interface Navigation {
    back: string;
    home: string;
    parameters: string;
    account: string;
    displaycart: string;
    addcart: string;
    addacard: string;
    help: string;
    infosrestaurant: string;
    orders: string;
    notifications: string;
    pastorders: string;
    orderstocome: string;
    seerestaurants: string;
    saveaddress: string;
  }
 
  type KeyOf<T> = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [K in keyof T & (string | number)]: T[K] extends object ? `${K}.${KeyOf<T[K]>}` : `${K}`;
  }[keyof T & (string | number)];
  
  export type Translation = KeyOf<TranslationObjType>