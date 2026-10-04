// ====== EDITA AQUI os dados da empresa e do stock ======
window.EMPRESA = {
  nome: "Automóveis Cuber Orlando",
  morada: "Rua João Chagas, nº 27, 3800-597 Cacia, Aveiro",
  telefone: "+351 000 000 000",
  whatsapp: "351000000000",
  email: "geralautomoveiscuber@gmail.com",
  horario: "Seg a Sex: 9h às 18h · Sáb: 9h às 13h",
  desde: 2023,
  abertura: {1:[9,18],2:[9,18],3:[9,18],4:[9,18],5:[9,18],6:[9,13]} // dia da semana (0=dom) : [abre, fecha]. Mantém igual ao horário acima.
};

window.SERVICOS = [
  ["Compra e venda de automóveis", "Ligeiros e pesados, novos ou usados.",
   "Vendemos viaturas revistas e compramos a tua. Avaliamos com transparência, explicamos o histórico do veículo e tratamos da documentação da transferência."],
  ["Importação e exportação", "Do transporte aos papéis, sem complicações.",
   "Procuras um carro noutro país ou queres vender um fora de Portugal? Acompanhamos o processo, desde a compra e o transporte até à legalização."],
  ["Transporte TVDE", "Viagens de passageiros por plataforma eletrónica.",
   "Serviço em viatura ligeira até nove lugares, incluindo o condutor, pedido através de plataforma eletrónica."],
  ["Entregas e estafetas", "Encomendas e correspondência, em cidade e fora dela.",
   "Envios postais, encomendas e entregas ao domicílio, com serviço urbano de estafeta e distribuição a nível nacional e internacional."]
];

// EXEMPLOS: troca por os teus carros. "foto" = ficheiro dentro da pasta img/
window.VEICULOS = [
  {id:1, marca:"Renault", modelo:"Clio 1.5 dCi", ano:2018, km:142000, preco:9900,  comb:"Gasóleo",  caixa:"Manual",     tipo:"Ligeiro",   destaque:true,  vendido:false, fotos:["img/clio-1.jpg","img/clio-2.jpg","img/clio-3.jpg","img/clio-4.jpg"],    descricao:"Económico e fiável, ideal para o dia a dia."},
  {id:2, marca:"Peugeot", modelo:"208 1.2 PureTech", ano:2020, km:78000, preco:12500, comb:"Gasolina", caixa:"Manual",   tipo:"Ligeiro",   destaque:true,  vendido:false, fotos:["img/208-1.jpg","img/208-2.jpg","img/208-3.jpg","img/208-4.jpg"],     descricao:""},
  {id:3, marca:"Toyota", modelo:"Corolla Hybrid", ano:2021, km:61000, preco:21900, comb:"Híbrido",  caixa:"Automática", tipo:"Ligeiro",   destaque:true,  vendido:false, fotos:["img/corolla-1.jpg","img/corolla-2.jpg","img/corolla-3.jpg","img/corolla-4.jpg"], descricao:""},
  {id:4, marca:"Citroën", modelo:"Berlingo Van", ano:2019, km:120000, preco:11800, comb:"Gasóleo", caixa:"Manual",     tipo:"Comercial", destaque:false, vendido:false, fotos:["img/berlingo-1.jpg","img/berlingo-2.jpg","img/berlingo-3.jpg","img/berlingo-4.jpg"], descricao:""},
  {id:5, marca:"Mercedes-Benz", modelo:"Sprinter 314", ano:2017, km:215000, preco:17500, comb:"Gasóleo", caixa:"Manual", tipo:"Pesado", destaque:false, vendido:false, fotos:["img/sprinter-1.jpg","img/sprinter-2.jpg","img/sprinter-3.jpg","img/sprinter-4.jpg"], descricao:""},
  {id:6, marca:"Volkswagen", modelo:"Golf 1.6 TDI", ano:2019, km:98000, preco:16900, comb:"Gasóleo", caixa:"Manual", tipo:"Ligeiro", destaque:false, vendido:true, fotos:["img/golf-1.jpg","img/golf-2.jpg","img/golf-3.jpg","img/golf-4.jpg"], descricao:""}
];

window.EMPRESA2 = { nome: "Cuber Orlando Construções" };

// Construção: título e descrição
window.CONSTRUCAO = [
  ["Construção civil e obras públicas", "Edifícios novos e obras de maior dimensão, do projeto à entrega."],
  ["Conservação e restauro de edifícios", "Recuperamos fachadas, telhados, interiores e estruturas antigas."],
  ["Acabamentos", "Pintura, revestimento de paredes e pavimentos, soalhos, tetos falsos e isolamentos."],
  ["Escavações, demolições e terraplenagens", "Preparação de terreno e demolições com equipamento adequado."],
  ["Canalização, eletricidade e climatização", "Instalação, reparação e manutenção, incluindo exaustão e aspiração central."],
  ["Energias renováveis e automatismos", "Sistemas de energias renováveis e automatismos para portões."],
  ["Carpintaria, caixilharia e serralharia", "Portas, janelas, estruturas metálicas e trabalhos por medida."],
  ["Sanitários e vidros", "Instalação de equipamento sanitário e colocação de vidros."]
];

// Perguntas frequentes: [grupo, pergunta, resposta]. REVÊ as respostas antes de publicar.
window.FAQ = [
  ["Automóveis", "Como posso pedir informações sobre um veículo?", "Abre a página do veículo e usa o botão de WhatsApp, telefone ou email, ou envia uma mensagem pelo formulário de contacto."],
  ["Automóveis", "E se não encontro o veículo que procuro?", "Envia um pedido de procura, com o modelo e o orçamento, pelo formulário de contacto."],
  ["Automóveis", "Que serviços automóveis existem?", "Compra e venda, importação e exportação de veículos ligeiros e pesados, transporte TVDE e entregas."],
  ["Construções", "Como peço um orçamento?", "Descreve a obra no formulário de contacto, escolhendo a área Construções, ou fala connosco por WhatsApp."],
  ["Construções", "Que serviços de construção existem?", "Consulta a lista na página Construções."],
  ["Construções", "Onde fica a empresa?", "Em Cacia, Aveiro. A morada completa está na página de contacto."]
];

// Opiniões de clientes: [empresa, nome, texto]. Só publicar opiniões reais. Vazio = a secção fica escondida.
window.OPINIOES = [];

// Projetos realizados (portfólio da Construção). Fica vazio até haveres fotos e dados reais.
// Formato: {nome:"...", categoria:"...", local:"...", estado:"Concluído", descricao:"...", fotos:["img/projeto-1.jpg"]}
window.PROJETOS = [];
