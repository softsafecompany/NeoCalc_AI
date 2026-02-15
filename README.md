
# 🧮 NeoCalc AI — O Matemático Inteligente Multimodal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%203-blueviolet)](https://ai.google.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange)](https://web.dev/progressive-web-apps/)

**NeoCalc AI** não é apenas uma calculadora; é um assistente matemático de última geração movido pelo modelo **Gemini 3 Flash** da Google. Projetado para ser rápido, bonito e extremamente capaz, ele resolve desde aritmética simples até cálculos simbólicos complexos através de texto ou visão computacional.

---

## ✨ Funcionalidades Principais

- **🕹️ Modo Standard:** Calculadora científica clássica com suporte a funções de potência e parênteses.
- **🧠 IA Smart (Natural Language):** Resolva problemas matemáticos complexos digitando-os como se estivesse conversando. "Qual a derivada de x² + 5x?" ou "Resolva a equação de segundo grau x² - 5x + 6 = 0".
- **📸 Visão Computacional:** Tire uma foto ou faça upload de um problema matemático (manuscrito ou impresso) e deixe a IA analisar e resolver para você.
- **📊 Visualização de Gráficos:** Para funções matemáticas, o app gera automaticamente um gráfico interativo usando **Recharts**.
- **📝 Explicações Passo a Passo:** Não receba apenas o resultado; entenda a lógica por trás de cada solução com breakdowns detalhados.
- **📱 Experiência Mobile Nativa (PWA):** Otimizado para iOS e Android com suporte a instalação na tela de início, funcionamento offline e SafeArea insets.

## 🚀 Tecnologias Utilizadas

- **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **IA/ML:** [Google Gemini API](https://ai.google.dev/gemini-api) (@google/genai)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Mobile:** [Capacitor](https://capacitorjs.com/) (Configurado para iOS/Android)
- **PWA:** Service Workers & Web Manifest

## 🛠️ Configuração e Instalação

### Pré-requisitos
- Uma chave de API do Google Gemini (obtenha em [Google AI Studio](https://aistudio.google.com/))

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/neocalc-ai.git
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a chave de API:**
   Crie um arquivo `.env` na raiz do projeto ou configure sua variável de ambiente:
   ```env
   API_KEY=sua_chave_aqui
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 📲 Instalação no iPhone (PWA)

Como o NeoCalc AI foi desenvolvido pensando em usuários de Windows que desejam o app no iPhone:

1. Faça o deploy do projeto (Vercel, Netlify, etc).
2. Abra a URL no **Safari** do iPhone.
3. Toque no botão **Compartilhar**.
4. Selecione **"Adicionar à Tela de Início"**.
5. O NeoCalc aparecerá com ícone próprio e sem as barras do navegador!

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por [Francisco Armando Chico](https://www.instagram.com/kascranky/)
