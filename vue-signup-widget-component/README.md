# studykik-signup-widget-vue-project

Welcome to StudyKIK’s External Sign-Up widget. The purpose of this widget is to be embedded onto your web page for participants to sign up and be contacted by StudyKIK’s Call Center for prescreening. This will allow our agents to contact and pre-qualify your participants for your specific research study. 

This widget has been built for Vue 3 projects, but will be expanding to other type of projects in the future. 

Please use the template while you develop with Vue 3 in Vite. 


## Project Setup

```sh
npm install
``` 

## Project Configuration

Copy the .env.example to .env and add the following configuration
```sh
# .env.example
VITE_STUDYKIK_SIGNUP_API=
VITE_STUDYKIK_PROTOCOL_LANDING_PAGE_UUID=
```

Your StudyKIK Project Manager will provide the respective credentials for the STUDYKIK_PROTOCOL_LANDING_PAGE_UUID and STUDYKIK_SIGNUP_API. This is critical as it will allow sign ups to be appropriately prescreened for your specific protocol. 

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
