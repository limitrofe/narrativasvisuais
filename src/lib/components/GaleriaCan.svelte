<script>
  import { onMount } from 'svelte';
  import Modal from './ModalCan.svelte';

  const participantes = [
    {NOME:"ADRIANA VELOSO",EQUIPE:"Profissional",INSTAGRAM:"https://www.instagram.com/chefadrianaveloso/",OCUPAÇÃO:"Chef de cozinha",IDADE:48,nomesobrenome:"AdrianaVeloso",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/adriana_veloso.webp",DESCRIÇÃO:"Nascida em Turiaçu, no Maranhão, cresceu em Belém, no Pará, e hoje mora no Rio de Janeiro. Chef de cozinha, carrega no seu trabalho os sabores e tradições da gastronomia paraense, o que rendeu a seu restaurante o prêmio de melhor restaurante brasileiro do Rio de Janeiro em 2022 e 2023."},
    {NOME:"ARIKA MESSA",EQUIPE:"Profissional",INSTAGRAM:"https://www.instagram.com/arikamessa/",OCUPAÇÃO:"Chef e professora de gastronomia",IDADE:42,nomesobrenome:"ArikaMessa",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/arika_messa.webp",DESCRIÇÃO:"Nascida em Porto Alegre e morando em Canela, no Rio Grande do Sul, com a esposa e duas filhas, Arika é Chef de cozinha e professora. Competitiva desde pequena, já foi jogadora de futebol e agora tem como meta conquistar o prêmio de meio milhão de reais do reality e alavancar seu nome e o da sua empresa."},
    {NOME:"BRUNA LOPES",EQUIPE:"Internet",INSTAGRAM:"https://www.instagram.com/chefbrunalopes/",OCUPAÇÃO:"Criadora de conteúdo",IDADE:39,nomesobrenome:"BrunaLopes",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/bruna_lopes.webp",DESCRIÇÃO:"Cresceu na cidade de Guararapes, em São Paulo, e, hoje, mora há mais de 11 anos em Campo Grande, no Mato Grosso do Sul. A criadora de conteúdo é de uma família de cozinheiros que não perde a oportunidade de se reunir em torno da mesa. Durante sete anos, esteve à frente de uma empresa de massas artesanais, sua especialidade"},
    {NOME:"BRUNO \"BUBU\" SALOMÃO",EQUIPE:"Internet",INSTAGRAM:"https://www.instagram.com/canseideserchef/",OCUPAÇÃO:"Empresário e criador de conteúdo",IDADE:35,nomesobrenome:"BrunoSalomão",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/bruno_salomao.webp",DESCRIÇÃO:"É Empresário e criador de conteúdo nascido em São Luís, no Maranhão, onde aprendeu os segredos da culinária local. Com a família também desenvolveu o gosto pela cozinha árabe e pelo churrasco. Conhecido como Bubu, ele é co-capitão da seleção brasileira de churrasco americano e atua como consultor gastronômico"},
    {NOME:"MARINA CABRAL",EQUIPE:"Amador",INSTAGRAM:"https://www.instagram.com/marina_cabral/",OCUPAÇÃO:"Empresária",IDADE:46,nomesobrenome:"MarinaCabral",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/marina_cabral.webp",DESCRIÇÃO:"Nasceu em Belém, no Pará, e vive na cidade de São Paulo. Empresária, comanda uma empresa que fornece insumos amazônicos para restaurantes do Sudeste. Aprendeu a cozinhar com o pai e, hoje, prepara diariamente as refeições para a filha, com quem tem uma forte ligação."},
    {NOME:"DIH VIDAL",EQUIPE:"Amador",INSTAGRAM:"https://www.instagram.com/dihvidal/",OCUPAÇÃO:"Empresária e estudante de gastronomia",IDADE:36,nomesobrenome:"DihVidal",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/dih_vidal.webp",DESCRIÇÃO:"Nasceu em Mucuri, na Bahia, e mora em São José dos Campos, interior de São Paulo. Dona de casa e vendedora de roupas, é muito dedicada à família: casada e mãe de dois filhos, Dih os considera seu porto seguro. O interesse pela cozinha veio com o nascimento do primeiro filho, e hoje ela persegue o sonho de ter seu próprio restaurante."},
    {NOME:"ERICKSON BLUN",EQUIPE:"Amador",INSTAGRAM:"https://www.instagram.com/ericksonblun/",OCUPAÇÃO:"Cirurgião do aparelho digestivo",IDADE:59,nomesobrenome:"EricksonBlun",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/erickson_blun.webp",DESCRIÇÃO:"Trabalha como cirurgião do aparelho digestivo e nasceu em Ponta Grossa, no Paraná, onde teve sua vida transformada pela medicina. Apaixonado pela gastronomia, compara um bom empratamento a uma cirurgia bem-feita. Também se considera um bom jogador de pôquer, além de conhecer bons insumos e ingredientes. Pretende usar essas habilidades na competição para surpreender os adversários e conquistar o paladar dos mentores."},
    {NOME:"FLAN SOUZA",EQUIPE:"Amador",INSTAGRAM:"https://www.instagram.com/flan_souza/",OCUPAÇÃO:"Técnica de enfermagem",IDADE:41,nomesobrenome:"FlanSouza",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/flan_souza.webp",DESCRIÇÃO:"A técnica de enfermagem nasceu em Salvador, na Bahia, e carrega na cozinha uma forte conexão com sua mãe e sua avó, suas grandes referências. Já vendeu cachorro-quente e empadas no hospital onde trabalhava e revela que aprendeu a fazer arroz soltinho com Ana Maria Braga. Atualmente, estuda gastronomia e se declara como uma amante da cozinha."},
    {NOME:"MARINA FUCANO",EQUIPE:"Internet",INSTAGRAM:"https://www.instagram.com/marinafucano/",OCUPAÇÃO:"Produtora de conteúdo digital",IDADE:33,nomesobrenome:"MarinaFucano",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/marina_fucano.webp",DESCRIÇÃO:"É criadora de conteúdo e deixou a carreira de farmacêutica para se dedicar à produção de conteúdo de culinária na internet. Na adolescência, chegou a ser locutora de rádio. Especialista em brasa e churrasco, ela se define como uma pessoa de pavio curto e coração mole."},
    {NOME:"GILMAR FRANCISCO",EQUIPE:"Amador",INSTAGRAM:"https://www.instagram.com/drgilmarfrancisco/",OCUPAÇÃO:"Médico anestesista e nutrólogo",IDADE:41,nomesobrenome:"GilmarFrancisco",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/gilmar_francisco.webp",DESCRIÇÃO:"O médico nutrólogo e anestesista nasceu em Cachoeiro de Itampemirim, no Espírito Santo, e sempre teve a família reunida em volta da mesa. Já enfrentou a obesidade e, hoje, dedica-se a ajudar as pessoas a terem uma relação mais saudável com a comida. Apaixonado por visitar restaurantes e reproduzir os pratos em casa para a família e os amigos."},
    {NOME:"IARA GUIMARÃES",EQUIPE:"Profissional",INSTAGRAM:"https://www.instagram.com/iara_guimaraes1/",OCUPAÇÃO:"Chef de partida",IDADE:38,nomesobrenome:"iaraguimaraes",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/iara_guimaraes.webp",DESCRIÇÃO:"Nasceu em Igaratinga, Minas Gerais, e vive Ericeira, Portugal. Chef de partida, aprendeu a cozinhar com o pai e carrega na bagagem o sabor e o afeto da comida mineira, que a faz lembrar da família e de suas raízes. Antes de se dedicar à gastronomia, trabalhou por 13 anos com contabilidade. Para ela, a cozinha é um lugar de memórias e partilha."},
    {NOME:"ÍCARO CONCEIÇÃO",EQUIPE:"Internet",INSTAGRAM:"https://www.instagram.com/cheficaro/",OCUPAÇÃO:"Chefe particular",IDADE:33,nomesobrenome:"ÍcaroConceição",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/icaro_conceicao.webp",DESCRIÇÃO:"Nasceu e vive em Porto Alegre, no Rio Grande do Sul. Chef particular e criador de conteúdo, virou cozinheiro aos 17 anos e se tornou chef aos 24, após passar por cozinhas estreladas. Durante as enchentes que atingiram seu estado, em 2024, comandou, ao lado de outros chefs, uma cozinha voluntária que servia mais de 20 mil pratos por dia."},
    {NOME:"JÚLIO NIEPS",EQUIPE:"Amador",INSTAGRAM:"https://www.instagram.com/julionieps/",OCUPAÇÃO:"Tatuador",IDADE:36,nomesobrenome:"JúlioNieps",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/julio_nieps.webp",DESCRIÇÃO:"Tatuador e motorista de aplicativo, nascido e criado em Americana, São Paulo, se define como caótico, teimoso e determinado. Autodidata, não se prende a receitas nem a estilos únicos. O fã de animes foi incentivado pela sogra a se inscrever no ‘Chef de Alto Nível’ e leva para a competição o desejo de curtir o processo."},
    {NOME:"KELMA ZANEIDE",EQUIPE:"Profissional",INSTAGRAM:"https://www.instagram.com/kitutugastronomiafrobrasileira/",OCUPAÇÃO:"Empreendedora",IDADE:53,nomesobrenome:"KelmaZenaide",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/kelma_zenaide.webp",DESCRIÇÃO:"Com 53 anos, a chef de cozinha nasceu em Contagem, em Minas Gerais, e aprendeu a cozinhar com a família. Neta de quilombola, guarda na memória os momentos em que o avô preparava refeições no quintal de casa. Especialista em literatura africana e à frente de uma cozinha de comida afro-brasileira, ela busca valorizar profissionais da cozinha negra e resgatar suas raízes."},
    {NOME:"LUIZ FERNANDO LIRA",EQUIPE:"Profissional",INSTAGRAM:"https://www.instagram.com/chefluizlira/",OCUPAÇÃO:"Consultor técnico de gastronomia",IDADE:35,nomesobrenome:"LuizLira",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/luiz_lira.webp",DESCRIÇÃO:"Consultor técnico de gastronomia, já atuou em cozinhas do Brasil, França e Espanha, trabalhando ao lado de chefs renomados e em restaurantes estrelados. Sua paixão pela cozinha vem de família: a avó Quitéria trabalhou por muitos anos com Ana Maria Braga, e ele chegou a acompanhá-la em algumas gravações."},
    {NOME:"LUCAS CORREIA",EQUIPE:"Profissional",INSTAGRAM:"https://www.instagram.com/lucascorreiachef/",OCUPAÇÃO:"Chef de cozinha",IDADE:37,nomesobrenome:"LucasCorreia",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/lucas_correia.webp",DESCRIÇÃO:"Vindo do Paraná, o Chef de cozinha experiente e viajado passou um ano em Moçambique comandando o restaurante de um hotel, já atuou como professor universitário de gastronomia e trabalhou muitos anos com a chef Manu Buffara. Atualmente, integra uma das principais cozinhas de Fernando de Noronha. "},
    {NOME:"LUIZA SOARES",EQUIPE:"Amador",INSTAGRAM:"https://www.instagram.com/luizasoares_br/",OCUPAÇÃO:"Nutricionista",IDADE:30,nomesobrenome:"LuizaSoares",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/luiza_soares.webp",DESCRIÇÃO:"Carioca e nutricionista, concluiu recentemente a faculdade de gastronomia e está realizando um sonho antigo: participar de um reality de culinária. Inspirada pelas avós, que sempre foram referência na cozinha, ela cresceu entre receitas e boas memórias."},
    {NOME:"ALLAN MAMEDE",EQUIPE:"Internet",INSTAGRAM:"https://www.instagram.com/chefmamede/",OCUPAÇÃO:"Personal chef",IDADE:26,nomesobrenome:"AllanMamede",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/allan_mamede.webp",DESCRIÇÃO:"Com foco na gastronomia brasileira, Mamede se dedica à culinária de fusão, combinando ingredientes e técnicas de diferentes tradições em busca de pratos inovadores. Em 2023, venceu o reality Que Seja Doce, exibido no GNT, e chega ao Chef de Alto Nível querendo ser exemplo para jovens da periferia, como ele."},
    {NOME:"MARIA CLARA CALDAS",EQUIPE:"Internet",INSTAGRAM:"https://www.instagram.com/claracaldas/",OCUPAÇÃO:"Criadora de conteúdo e estudante de ADM",IDADE:26,nomesobrenome:"MariaClara",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/maria_clara.webp",DESCRIÇÃO:"Vivendo em Lisboa, Portugal, aos 23 anos, divide seu tempo entre a faculdade de Administração e a criação de conteúdo de gastronomia na internet. Desde a pandemia, compartilha suas experiências culinárias na internet. A jovem vendia doces em datas comemorativas, fez curso de massas e participou de um workshop na renomada Le Cordon Bleu, em Paris."},
    {NOME:"MARITZA BOJOVSKI",EQUIPE:"Internet",INSTAGRAM:"https://www.instagram.com/maribojovski/",OCUPAÇÃO:"Influenciadora digital e dona de restaurante",IDADE:36,nomesobrenome:"MaritzaBojovski",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/maritza_bojovski.webp",DESCRIÇÃO:"Criadora de conteúdo e proprietária de restaurante, ela comanda a cozinha do negócio da família, inspirada por seu pai, chef de cozinha e sua maior referência. Competitiva e exigente consigo mesma, Maritza também é jogadora de beach tênis e admite ter dificuldade com derrotas."},
    {NOME:"BRUNO MANOEL",EQUIPE:"Internet",INSTAGRAM:"https://www.instagram.com/preto_na_cozinha/",OCUPAÇÃO:"Influenciador digital",IDADE:40,nomesobrenome:"BrunoManoel",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/bruno_manoel.webp",DESCRIÇÃO:"Conhecido como Preto, o criador de conteúdo tem 40 anos acumula mais de 800 mil seguidores em seu perfil. Em 2023, Bruno venceu a competição Que Delícia!, do Mais Você, e agora chega ao reality querendo mostrar os temperos pernambucanos que o Brasil não conhece."},
    {NOME:"RAPHAEL SANTOS",EQUIPE:"Profissional",INSTAGRAM:"https://www.instagram.com/chefraphasantos/",OCUPAÇÃO:"Personal chef",IDADE:31,nomesobrenome:"RaphaelSantos",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/raphael_santos.webp",DESCRIÇÃO:"Nascido no Rio de Janeiro, vive há nove anos em Lisboa, Portugal. Personal chef, tem em seu pai, também chef de cozinha, sua maior inspiração e melhor amigo. Na adolescência, sonhava em ser jogador de futebol, mas foi na gastronomia que encontrou sua paixão. Para se aperfeiçoar, trabalhou em açougue e peixaria, aprendendo na prática a carnear e filetar."},
    {NOME:"RODRIGO ANDRADE",EQUIPE:"Profissional",INSTAGRAM:"https://www.instagram.com/rodrigoandradesil/",OCUPAÇÃO:"Chef e dono de bistrô",IDADE:24,nomesobrenome:"RodrigoAndrade",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/rodrigo_andrade.webp",DESCRIÇÃO:"Chef de cozinha e dono de um restaurante que homenageia sua avó, ele cozinha profissionalmente há sete anos. O jovem é também técnico em Mecânica e começou a cursar Engenharia Elétrica. Competitivo, Rodrigo chega ao reality com a missão de provar que comida regional também é alta gastronomia."},
    {NOME:"BRUNO SUTIL",EQUIPE:"Amador",INSTAGRAM:"https://www.instagram.com/brunosutil/",OCUPAÇÃO:"Pesquisador sensorial",IDADE:35,nomesobrenome:"BrunoSutil",foto:"https://s3.glbimg.com/v1/AUTH_8b29beb0cbe247a296f902be2fe084b6/2025/html/receitas/can/img/part/bruno_sutil.webp",DESCRIÇÃO:"Pesquisador sensorial, dedica-se a entender como os sentidos influenciam as decisões das pessoas, prestando consultoria para marcas de alimentos e produtos de limpeza, por exemplo. Apaixonado por gastronomia, se define como um “nerd” do assunto. Ao se mudar para a capital paulista, contava com a ajuda da mãe, que o guiava nas receitas em chamadas de vídeo."},
  ];

  const todasAsEquipes = [...new Set(participantes.map(p => p.EQUIPE))];

  let filtroAtivo = 'todos';
  let sortBy = 'alfabetica';
  let participanteSelecionado = null;

  function setFiltro(equipe) {
    filtroAtivo = equipe;
  }
  
  $: participantesFiltrados = participantes
    .filter(p => filtroAtivo === 'todos' || p.EQUIPE === filtroAtivo)
    .sort((a, b) => {
      if (sortBy === 'idade') {
        return a.IDADE - b.IDADE;
      }
      return a.NOME.localeCompare(b.NOME);
    });

</script>

<div class="container">
  <h1>Participantes</h1>

  <div class="controles-container">
    <span class="controle-label">Filtros:</span>
    <button 
      class="filter-button"
      class:active={filtroAtivo === 'todos'}
      on:click={() => setFiltro('todos')}
    >
      Todos
    </button>
    {#each todasAsEquipes as equipe}
      <button 
        class="filter-button" 
        class:active={filtroAtivo === equipe}
        on:click={() => setFiltro(equipe)}
      >
        {equipe}
      </button>
    {/each}

    <span class="controle-label separador">Classifique por:</span>

    <button 
      class="filter-button" 
      class:active={sortBy === 'alfabetica'}
      on:click={() => sortBy = 'alfabetica'}
    >
      Nome (A-Z)
    </button>
    <button 
      class="filter-button" 
      class:active={sortBy === 'idade'}
      on:click={() => sortBy = 'idade'}
    >
      Idade
    </button>
  </div>
  <div class="gallery-grid">
    {#each participantesFiltrados as participante (participante.nomesobrenome)}
      <div class="card" on:click={() => participanteSelecionado = participante} role="button" tabindex="0" aria-label="Ver detalhes de {participante.NOME}">
        <img src={participante.foto} alt="Foto de {participante.NOME}">
        <div class="card-info">
          <h2>{participante.NOME}</h2>
          <span class="badge {participante.EQUIPE.toLowerCase()}">{participante.EQUIPE}</span>
        </div>
      </div>
    {/each}
  </div>
</div>

{#if participanteSelecionado}
  <Modal 
    participante={participanteSelecionado} 
    on:close={() => participanteSelecionado = null} 
  />
{/if}

<style>
  :global(body) {
    font-family: 'Globotipo', sans-serif; 
    color: #fff;
  }

  .container {
    max-width: 1800px;
    margin: 2rem auto;
    padding: 2rem;
    transition: padding 0.3s ease;
  }

  h1 {
    text-align: center;
    color: #fff;
    margin-bottom: 2rem;
  }

  /* ================================================= */
  /* INÍCIO DAS REGRAS DE ESTILO ALTERADAS (CSS)       */
  /* ================================================= */
  
  .controles-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    overflow-x: auto;
    padding: 0.5rem 0;
    margin-bottom: 2rem;
    scrollbar-width: none;
  }

  .controles-container::-webkit-scrollbar {
    display: none; 
  }

  /* NOVO: Estilo para os textos "Filtros:" e "Classifique por:" */
  .controle-label {
    font-size: 1rem;
    font-weight: 500;
    color: #f0f0f0;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* NOVO: Estilo para o separador */
  .controle-label.separador {
    margin-left: 1rem;
    padding-left: 1.75rem;
    color: #aaa;
  }

  .filter-button {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    font-weight: 500;
    background-color: #3a3a3a;
    color: #ccc;
    border: 1px solid #555;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    white-space: nowrap;
    font-family: 'Globotipo', sans-serif; 
  }

  .filter-button:hover {
    background-color: #4a4a4a;
    border-color: #777;
    color: #fff;
  }

  .filter-button.active {
    color: #fff;
    border-color: #ffffff;
    background-color: #d1263d;
  }

  /* =============================================== */
  /* FIM DAS REGRAS DE ESTILO ALTERADAS (CSS)        */
  /* =============================================== */

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 1rem;
  }

  .card {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s ease-in-out;
    cursor: pointer;
    aspect-ratio: 9 / 16;
  }

  .card:hover {
    transform: scale(1.05);
    z-index: 10;
  }

  .card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .card-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.25rem;
    color: #fff;
    background: transparent; 
    text-shadow: 1px 1px 4px rgba(0,0,0,0.7); 
    margin-top: 8px;
    font-family: 'Globotipo', sans-serif; 
  }

  .card-info h2 {
    margin: 0 0 0rem 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.2;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.7); 
    font-family: 'Globotipo', sans-serif; 
  }

  .badge {
    display: inline-block;
    padding: 0rem;
    font-size: 0.8rem;
    font-weight: bold;
    color: #fff;
    border-radius: 0px;
    text-transform: uppercase;
    font-family: 'Globotipo', sans-serif; 
  }

  .badge.profissional { background-color: transparent; }
  .badge.internet { background-color: transparent; }
  .badge.amador { background-color: transparent; }

  @media (max-width: 768px) {
    .container {
      padding: 1rem; 
    }
    
    .gallery-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
    }

    .card {
      aspect-ratio: 9/19.5;
    }

    .card img {
      height: auto;
    }

    .card-info {
      position: static;
      background: none;
      text-shadow: none;
      padding: 0rem;
    }

    .card-info h2 {
      font-size: 0.75rem;
      margin-bottom: 0rem;
      margin-top: 0;
      line-height: 1rem;
    }

    .badge {
      font-size: 0.8rem;
      padding: 0rem;
      text-transform: lowercase;
      font-weight: 300;
    }
  }
</style>