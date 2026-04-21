const firebaseConfig = {
  apiKey: "AIzaSyBmOVLv4eCvEwXtqyP8KJGy8aAqsY1JCpI",
  authDomain: "checklist-cmc.firebaseapp.com",
  projectId: "checklist-cmc",
  storageBucket: "checklist-cmc.firebasestorage.app",
  messagingSenderId: "897550915134",
  appId: "1:897550915134:web:e8181cd588be727aec236f"
};

firebase.initializeApp(firebaseConfig);

window.db = firebase.firestore();

const usuarioFake = {
  nome: "Usuário Teste",
  tipo: "TECNICO"
};

