import { createApp, vaporInteropPlugin } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use(vaporInteropPlugin);
app.mount('#app');