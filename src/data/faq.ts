import type { PerguntaFaq } from "../types";

export const perguntasFaq: PerguntaFaq[] = [
  {
    pergunta: "O que é o Acesso Já?",
    resposta: "É um board público de avisos urbanos. O cidadão registra um problema com foto, outros moradores confirmam e o órgão responsável atualiza o andamento à vista de todos.",
  },
  {
    pergunta: "Quais problemas posso registrar?",
    resposta: "Cinco categorias: transporte (como falha no metrô), alagamento, delito (assaltos frequentes em uma rua, por exemplo), zeladoria (veículo abandonado, obra parada) e outro.",
  },
  {
    pergunta: "Por que meu aviso precisa de 3 confirmações?",
    resposta: "A confirmação de 3 pessoas diferentes filtra relatos isolados e mostra ao órgão que o problema afeta mais gente. Ninguém pode confirmar o próprio aviso.",
  },
  {
    pergunta: "O que significa cada status?",
    resposta: "Não recebida: o órgão ainda não viu. Recebida: o órgão tomou conhecimento. Resolvendo: há uma ação em andamento. Resolvida: o problema foi solucionado. As etapas seguem sempre essa ordem.",
  },
  {
    pergunta: "E se estiver acontecendo um crime agora?",
    resposta: "Emergências não entram no board. Ligue 190 (polícia), 193 (bombeiros) ou 192 (SAMU). Na categoria delito, o app pergunta se está acontecendo agora e, se sim, orienta a ligar e não registra o aviso.",
  },
  {
    pergunta: "Minha identidade aparece no aviso?",
    resposta: "Não. Quem denuncia só é visível para o órgão responsável. As fotos não podem mostrar rostos, e placas de veículos só aparecem para o órgão.",
  },
  {
    pergunta: "Existe limite de avisos?",
    resposta: "Sim. Cada pessoa pode registrar até 5 avisos por dia, e avisos iguais enviados em menos de 10 minutos são bloqueados como duplicados.",
  },
  {
    pergunta: "Quanto custa?",
    resposta: "Para o cidadão, nada. Quem contrata o Acesso Já é o órgão público, por assinatura anual do painel de gestão.",
  },
];
