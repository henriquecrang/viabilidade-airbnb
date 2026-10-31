/* Configuração inicial independente dos assistentes de edição existentes. */
(() => {
  'use strict';
  const clone = x => JSON.parse(JSON.stringify(x));
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  const api = () => window.SimulatorAirbnb;
  const read = (o, path) => path.split('.').reduce((v, k) => v?.[k], o);
  const write = (o, path, value) => {
    const keys = path.split('.');
    let ref = o;
    keys.slice(0, -1).forEach(k => { ref = ref[k] ??= {}; });
    ref[keys.at(-1)] = value;
  };
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });
  const num = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
  const labels = {
    'airbnb-self': 'Temporada · autogestão',
    'airbnb-admin-essential': 'Temporada · Essencial',
    'airbnb-admin': 'Temporada · Premium',
    'airbnb-rented': 'Imóvel alugado · autogestão',
    'airbnb-rented-admin-essential': 'Imóvel alugado · Essencial',
    'airbnb-rented-admin': 'Imóvel alugado · Premium',
    traditional: 'Aluguel tradicional', investment: 'Investimento financeiro',
    'idle-property': 'Imóvel parado'
  };
  const yesNo = [['yes', 'Sim'], ['no', 'Não']];
  const phases = ['Seu objetivo', 'Imóvel', 'Receitas', 'Custos e trabalho', 'Comparação'];

  function context(a = {}) {
    const rented = a.situation === 'rent-third-party';
    const buy = a.situation === 'capital-buy';
    const airbnb = rented || a.modality !== 'traditional';
    const traditional = !rented && ['traditional', 'both'].includes(a.modality);
    const self = airbnb && a.management !== 'admin';
    const admin = airbnb && ['admin', 'both'].includes(a.management);
    const essential = admin && a.plan !== 'premium';
    const premium = admin && a.plan !== 'essential';
    const hybrid = !rented && airbnb && ['occasional', 'home'].includes(a.personalUse);
    return { rented, buy, airbnb, traditional, self, admin, essential, premium, hybrid };
  }

  function scenarioIds(a = {}) {
    const c = context(a), ids = [];
    if (c.airbnb) {
      if (c.self) ids.push(c.rented ? 'airbnb-rented' : 'airbnb-self');
      if (c.essential) ids.push(c.rented ? 'airbnb-rented-admin-essential' : 'airbnb-admin-essential');
      if (c.premium) ids.push(c.rented ? 'airbnb-rented-admin' : 'airbnb-admin');
    }
    if (!c.rented && a.idle === 'yes') ids.push('idle-property');
    if (c.traditional) ids.push('traditional');
    if (!c.rented && a.compareInvestment === 'yes') ids.push('investment');
    return ids;
  }

  function targetValue(base, target) {
    if (target.profile) return target.profile === 'essential' ? 15 : 25;
    if (target.path) return read(base, target.path);
    return base[target.collection].find(x => x.id === target.item)?.[target.field];
  }
  function setTarget(base, target, value) {
    if (target.path) write(base, target.path, value);
    else base[target.collection].find(x => x.id === target.item)[target.field] = value;
  }

  function questions(a = {}) {
    const base = api().defaultState, c = context(a), qs = [];
    const choice = (id, title, options, phase = 'Seu objetivo', help = '') => qs.push({ id, title, options, type: 'choice', phase, help });
    const number = (id, title, target, unit, phase, extra = {}) => {
      const scale = extra.scale || 1;
      qs.push({ id, title, target, unit, phase, type: 'number', min: 0, step: 'any',
        defaultValue: targetValue(base, target) * scale, ...extra });
    };
    const path = (id, title, p, unit, phase, extra) => number(id, title, { path: p }, unit, phase, extra);
    const item = (id, title, collection, key, field, unit, phase, extra) => number(id, title,
      { collection, item: key, field }, unit, phase, extra);

    choice('situation', 'Qual é seu ponto de partida?', [
      ['owned', 'Já tenho um imóvel'], ['capital-buy', 'Tenho dinheiro e considero comprar'],
      ['rent-third-party', 'Quero alugar um imóvel para operar temporada']
    ]);
    if (!c.rented) choice('modality', 'Que tipo de locação você quer avaliar?', [
      ['airbnb', 'Temporada'], ['traditional', 'Aluguel tradicional'], ['both', 'Quero comparar os dois']
    ]);
    if (c.airbnb) choice('management', 'Quem cuidaria da locação por temporada?', [
      ['self', 'Eu mesmo'], ['admin', 'Uma administradora'], ['both', 'Quero comparar as duas formas']
    ]);
    if (c.admin) choice('plan', 'Quais planos de administradora quer avaliar?', [
      ['essential', 'Essencial · referência de 15%', 'Limpeza, lavanderia e amenidades ficam com você.'],
      ['premium', 'Premium · referência de 25%', 'Inclui a gestão dessas tarefas; despesas de terceiros continuam separadas.'],
      ['both', 'Quero comparar os dois planos']
    ], 'Seu objetivo', 'São referências de escopo de uma proposta recebida, editáveis nas próximas perguntas.');
    if (!c.rented && c.airbnb) choice('personalUse', 'Você também pretende usar o imóvel?', [
      ['none', 'Não, será destinado à renda'], ['occasional', 'Sim, em alguns períodos'], ['home', 'Sim, será minha moradia']
    ]);
    if (!c.rented) {
      choice('compareInvestment', c.buy ? 'Quer comparar com manter o dinheiro investido?' : 'Quer comparar com vender o imóvel e investir?', yesNo);
      choice('idle', 'Quer incluir o cenário de imóvel parado?', yesNo, 'Seu objetivo', 'Mostra o custo de manter o imóvel sem receita de locação.');
    }
    qs.push({ id: 'scenarioSummary', type: 'summary', phase: 'Seu objetivo', title: 'É isso que vamos comparar', help: 'Volte se quiser mudar alguma escolha. Agora vamos preencher somente os dados desses caminhos.' });

    if (c.buy) {
      path('availableCapital', 'Quanto dinheiro você tem disponível para a compra?', 'guidedSetup.acquisitionSale.availableCapital', 'R$', 'Imóvel', { defaultValue: base.globals.propertyValue, help: 'Capital próprio já disponível. Não inclua o financiamento. A referência abaixo é apenas ilustrativa.' });
      path('purchasePrice', 'Qual é o preço de compra do imóvel?', 'guidedSetup.acquisitionSale.purchasePrice', 'R$', 'Imóvel', { min: .01 });
      path('purchaseCosts', 'Quanto custam os impostos e documentos da compra?', 'guidedSetup.acquisitionSale.purchaseCosts', 'R$', 'Imóvel', { help: 'ITBI, registro, escritura e outros custos de aquisição. Zero é uma referência a preencher, não uma estimativa de gratuidade.' });
      choice('financing', 'Você pretende usar financiamento?', yesNo, 'Imóvel');
      if (a.financing === 'yes') {
        path('financingPrincipal', 'Quanto será financiado?', 'guidedSetup.acquisitionSale.financingPrincipal', 'R$', 'Imóvel', { min: .01 });
        path('financingRate', 'Qual é a taxa efetiva anual do financiamento?', 'guidedSetup.acquisitionSale.financingAnnualRatePct', '% ao ano', 'Imóvel');
        path('financingTerm', 'Em quantos anos pretende quitar o financiamento?', 'guidedSetup.acquisitionSale.financingTermYears', 'anos', 'Imóvel', { min: 1, step: 1 });
        path('financingCosts', 'Quanto custam a contratação e as tarifas iniciais do crédito?', 'guidedSetup.acquisitionSale.financingOriginationCosts', 'R$', 'Imóvel');
      }
      choice('additionalEquity', 'Haverá um aporte próprio além do dinheiro já informado?', yesNo, 'Imóvel');
      if (a.additionalEquity === 'yes') path('additionalEquityAmount', 'Qual será o aporte próprio adicional?', 'guidedSetup.acquisitionSale.additionalEquity', 'R$', 'Imóvel', { min: .01 });
    } else if (!c.rented) {
      path('propertyValue', 'Quanto vale seu imóvel hoje?', 'globals.propertyValue', 'R$', 'Imóvel', { min: .01 });
    } else {
      path('leaseRent', 'Quanto você pagará de aluguel ao proprietário?', 'rentedAirbnb.monthlyLeaseRent', 'R$ por mês', 'Imóvel');
      choice('furnished', 'O imóvel já vem mobiliado?', yesNo, 'Imóvel');
      choice('subleaseAuthorized', 'O contrato autoriza a operação de temporada?', [['yes', 'Sim'], ['no', 'Não'], ['unknown', 'Ainda não confirmei']], 'Imóvel', 'Você pode simular mesmo sem confirmação. A pendência ficará visível na revisão e na tela principal.');
      path('deposit', 'Qual é o valor da caução reembolsável?', 'rentedAirbnb.securityDeposit', 'R$', 'Imóvel');
      path('leaseInitial', 'Há outros custos iniciais do contrato?', 'rentedAirbnb.initialLeaseCosts', 'R$', 'Imóvel');
      path('leaseAnnual', 'Quanto custam as despesas anuais do contrato ou garantia?', 'rentedAirbnb.annualLeaseCosts', 'R$ por ano', 'Imóvel');
    }

    if (c.airbnb) {
      choice('preparation', 'Como quer configurar a preparação do imóvel?', c.rented ? [
        ['reference', 'Usar os valores de referência', 'Montagem e complementação de um apartamento de 1 quarto; valores serão discriminados na revisão.'],
        ['detail', 'Preencher cada item'], ['none', 'Já está pronto · sem investimento inicial']
      ] : [['none', 'Já está pronto · sem investimento inicial'], ['detail', 'Preencher cada item necessário']], 'Imóvel');
      if (a.preparation === 'detail') for (const x of base.setupCosts) {
        if (c.rented && a.furnished === 'yes' && x.rentedOnlyIfUnfurnished) continue;
        item(`setup_${x.id}`, `Quanto pretende investir em ${x.name.toLowerCase()}?`, 'setupCosts', x.id, c.rented ? 'rentedAmount' : 'amount', 'R$', 'Imóvel');
      }
    }

    if (c.airbnb) {
      choice('seasonMode', 'Como quer configurar diárias e ocupação?', [
        ['reference', 'Manter a sazonalidade de referência', 'Rio: diárias de R$ 250 a R$ 750 e ocupação de autogestão de 50% a 100%, conforme o período.'],
        ['detail', 'Revisar período por período']
      ], 'Receitas', 'A referência é do Rio em outubro de 2026, para um apartamento de 1 quarto. Não é uma estimativa para qualquer imóvel.');
      if (a.seasonMode === 'detail') {
        choice('occupancyBasis', 'A ocupação que você vai informar é de qual operação?', [['self', 'Autogestão'], ['admin', 'Com administradora']], 'Receitas');
      }
      if (c.admin || (a.seasonMode === 'detail' && a.occupancyBasis === 'admin')) path('managementDelta', 'Quanto a administradora pode acrescentar à ocupação?', 'airbnb.managementOccupancyDeltaPp', 'pontos percentuais', 'Receitas', { max: 100, help: 'Referência: +20 pontos percentuais em cada período, limitada a 100%. É uma hipótese editável, não uma garantia.' });
      for (const x of base.seasons) {
        if (c.hybrid) item(`use_${x.id}`, `Quantos dias de ${x.name} você reservará para seu uso?`, 'seasons', x.id, a.personalUse === 'home' ? 'habitualUseDays' : 'personalUseDays', 'dias', 'Receitas', { max: x.days, step: 1, help: `Esse período tem ${x.days} dias. Uso próprio sai da oferta; não é vacância.` });
        if (a.seasonMode === 'detail') {
          item(`rate_${x.id}`, `Qual a diária esperada em ${x.name}?`, 'seasons', x.id, 'nightlyRate', 'R$ por noite', 'Receitas');
          const delta = own(a, 'managementDelta') ? Number(a.managementDelta) : base.airbnb.managementOccupancyDeltaPp;
          item(`occupancy_${x.id}`, `Qual a ocupação esperada em ${x.name}?`, 'seasons', x.id, 'occupancyPct', '% dos dias disponíveis', 'Receitas', { max: 100, defaultValue: a.occupancyBasis === 'admin' ? Math.min(100, x.occupancyPct + delta) : x.occupancyPct, help: a.occupancyBasis === 'admin' ? 'Ocupação com administradora; o motor deriva a autogestão usando a diferença informada.' : 'Ocupação de autogestão; a administradora terá a diferença configurada.' });
        }
      }
      path('avgStay', 'Quantas noites dura uma estadia média?', 'airbnb.avgStayNights', 'noites por reserva', 'Receitas', { min: .1 });
      path('cleaningRevenue', 'Quanto você cobra do hóspede pela limpeza?', 'airbnb.cleaningFeeRevenue', 'R$ por reserva', 'Receitas', { help: 'É receita cobrada do hóspede. O custo efetivo de limpar será perguntado separadamente.' });
      path('otherGuestFees', 'Há outras taxas cobradas do hóspede?', 'airbnb.otherGuestFeeRevenue', 'R$ por reserva', 'Receitas');
    }
    if (c.traditional) {
      path('traditionalRent', 'Quanto espera receber de aluguel tradicional?', 'traditional.monthlyRent', 'R$ por mês', 'Receitas');
      path('traditionalOccupancy', 'Qual a ocupação anual esperada no aluguel tradicional?', 'traditional.occupancyPct', '% do ano', 'Receitas', { max: 100, help: '95% equivale a aproximadamente 18 dias sem aluguel por ano.' });
      path('traditionalFee', 'Qual a comissão da imobiliária?', 'traditional.managementFeePct', '% da receita', 'Custos e trabalho', { max: 100 });
      choice('traditionalCharges', 'Quem pagará condomínio, IPTU e coleta de lixo no aluguel tradicional?', [['tenant', 'O inquilino'], ['owner', 'Eu, como proprietário']], 'Custos e trabalho', 'As despesas são atribuídas ao proprietário apenas se você escolher essa opção.');
    }
    if (c.rented) choice('rentedCharges', 'Quais encargos você pagará além do aluguel?', [
      ['condo', 'Condomínio, além das contas de consumo'],
      ['all', 'Condomínio, IPTU e coleta de lixo, além do consumo'],
      ['utilities', 'Somente as contas de consumo']
    ], 'Custos e trabalho', 'Use os controles detalhados depois para um contrato com outra divisão de despesas.');

    const chargeIds = new Set(['condominio', 'iptu', 'tcl']);
    for (const x of base.monthlyCosts) {
      if (!['condominio', 'iptu', 'tcl', 'seguro', 'agua', 'luz', 'gas', 'internet'].includes(x.id)) continue;
      const rentalPays = c.rented && (chargeIds.has(x.id) ? a.rentedCharges === 'all' || (x.id === 'condominio' && a.rentedCharges !== 'utilities') : x.rentedAirbnb);
      const relevant = rentalPays || (!c.rented && ((c.airbnb && x.airbnb) || (a.idle === 'yes' && x.idleProperty) || (c.traditional && a.traditionalCharges === 'owner' && chargeIds.has(x.id))));
      if (!relevant) continue;
      const annual = ['iptu', 'tcl', 'seguro'].includes(x.id);
      item(`monthly_${x.id}`, `Quanto custa ${x.id === 'tcl' ? 'a coleta de lixo (TCL)' : x.name.toLowerCase()} ${annual ? 'por ano' : 'por mês'}?`, 'monthlyCosts', x.id, 'amount', annual ? 'R$ por ano' : 'R$ por mês', 'Custos e trabalho', { scale: annual ? 12 : 1, help: x.id === 'iptu' ? 'A referência de R$ 0 vem da isenção do imóvel-base. Confira o carnê do seu imóvel.' : x.id === 'tcl' ? 'Referência do imóvel-base: R$ 625/ano. Confira seu carnê.' : 'Valor de referência do cenário-base; substitua pela despesa esperada no seu imóvel.' });
    }
    if (c.airbnb) {
      for (const x of base.stayCosts) {
        item(`stay_${x.id}`, `Quanto custa ${x.name.toLowerCase()} a cada reserva?`, 'stayCosts', x.id, 'amount', 'R$ por reserva', 'Custos e trabalho', { help: 'Despesa efetiva, mesmo quando a administradora coordena a tarefa. O preset não presume serviço gratuito.' });
        if (c.self || (c.essential && ['limpeza', 'lavanderia', 'amenidades'].includes(x.id))) {
          item(`hours_${x.id}`, `Quanto tempo você gasta com ${x.name.toLowerCase()} por reserva?`, 'stayCosts', x.id, 'ownerHoursPerReservation', 'horas por reserva', 'Custos e trabalho', { help: 'O tempo só entra nos cenários em que essa tarefa fica com você.' });
        }
      }
      path('platformFee', 'Qual a taxa da plataforma de reservas?', 'airbnb.platformFeePct', '% da receita', 'Custos e trabalho', { max: 100 });
      if (c.essential) number('commissionEssential', 'Qual a comissão do plano Essencial?', { profile: 'essential', field: 'commissionPct' }, '% após a taxa da plataforma', 'Custos e trabalho', { defaultValue: 15, max: 100 });
      if (c.premium) number('commissionPremium', 'Qual a comissão do plano Premium?', { profile: 'premium', field: 'commissionPct' }, '% após a taxa da plataforma', 'Custos e trabalho', { defaultValue: 25, max: 100 });
      if (c.admin) path('supervision', 'Quanto tempo gastará acompanhando a administradora?', 'work.supervisionAdminHoursMonthly', 'horas por mês', 'Custos e trabalho');
      if (c.rented && c.admin && !c.self) path('leaseHours', 'Quanto tempo mensal dedicará ao contrato e ao imóvel alugado?', 'work.rentedAirbnbHoursMonthly', 'horas por mês', 'Custos e trabalho', { help: 'Tempo adicional, além de acompanhar a administradora e das tarefas por reserva que ficam com você.' });
      choice('detailOps', 'Quer revisar os demais custos e horas da operação?', [
        ['reference', 'Manter as referências e conferir no resumo'], ['detail', 'Preencher um item de cada vez']
      ], 'Custos e trabalho', 'Inclui atendimento, suporte, marketing, software, contabilidade, licenças, manutenção, reservas e capital de giro.');
      if (a.detailOps === 'detail') {
        for (const x of base.monthlyCosts.filter(x => !['condominio','iptu','tcl','seguro','agua','luz','gas','internet'].includes(x.id) && (c.rented ? x.rentedAirbnb : x.airbnb))) {
          item(`ops_${x.id}`, `Quanto custa ${x.name.toLowerCase()} por mês?`, 'monthlyCosts', x.id, 'amount', 'R$ por mês', 'Custos e trabalho');
          if (c.self) item(`opsHours_${x.id}`, `Quanto tempo você dedica a ${x.name.toLowerCase()} por mês?`, 'monthlyCosts', x.id, 'ownerHoursMonthly', 'horas por mês', 'Custos e trabalho');
        }
        for (const x of base.percentageCosts) item(`pct_${x.id}`, `Qual o percentual para ${x.name.toLowerCase()}?`, 'percentageCosts', x.id, 'pct', '% da receita', 'Custos e trabalho', { max: 100 });
        for (const x of base.reserveFunds) {
          item(`reserve_${x.id}`, `Quanto reservará para ${x.name.toLowerCase()}?`, 'reserveFunds', x.id, 'pct', '% da receita', 'Custos e trabalho', { max: 100 });
          item(`opening_${x.id}`, 'Quanto já existe nesse fundo de reserva?', 'reserveFunds', x.id, 'openingBalance', 'R$', 'Custos e trabalho');
        }
        const targets = c.rented ? ['rentedAirbnb'] : [...(c.self ? ['airbnbSelf'] : []), ...(c.admin ? ['airbnbAdmin'] : [])];
        for (const key of targets) path(`working_${key}`, `Quanto manterá de capital de giro em ${key === 'airbnbSelf' ? 'autogestão' : key === 'airbnbAdmin' ? 'gestão com administradora' : 'temporada no imóvel alugado'}?`, `workingCapital.${key}`, 'R$', 'Custos e trabalho');
      }
      if (c.self) path('selfHours', 'Quantas outras horas mensais dedicará à autogestão?', c.rented ? 'work.rentedAirbnbHoursMonthly' : 'work.selfHoursMonthly', 'horas por mês', 'Custos e trabalho', { help: 'Somente tempo adicional, além das tarefas por reserva e das atividades recorrentes já consideradas.' });
      path('airbnbTax', 'Qual a alíquota efetiva estimada de imposto da temporada?', 'airbnb.taxPct', '% da base tributável', 'Custos e trabalho', { max: 100, help: '15% é um exemplo do simulador. Ajuste à sua situação. A dedutibilidade segue as marcações detalhadas existentes.' });
    }
    if (c.traditional) {
      path('traditionalTax', 'Qual a alíquota efetiva estimada de imposto do aluguel tradicional?', 'traditional.taxPct', '% da base tributável', 'Custos e trabalho', { max: 100 });
      path('traditionalHours', 'Quanto tempo dedicará ao aluguel tradicional por mês?', 'work.traditionalHoursMonthly', 'horas por mês', 'Custos e trabalho');
    }
    if (!c.rented && a.idle === 'yes') path('idleHours', 'Quanto tempo gastará supervisionando o imóvel parado?', 'work.idlePropertyHoursMonthly', 'horas por mês', 'Custos e trabalho');
    if (c.hybrid) choice('hybridBenefits', 'Quer informar o benefício do seu uso pessoal?', [['no', 'Manter benefício de consumo em zero'], ['yes', 'Informar esse benefício']], 'Comparação', 'Hospedagem evitada e moradia são benefícios de consumo, separados da receita de aluguel.');
    if (c.hybrid && a.hybridBenefits === 'yes') {
      if (a.personalUse === 'home') path('housingBenefit', 'Qual o benefício anual estimado de morar no imóvel?', 'hybridUse.habitualHousingBenefitAnnual', 'R$ por ano', 'Comparação');
      else path('lodgingBenefit', 'Quanto você economiza em hospedagem por dia de uso?', 'hybridUse.avoidedLodgingPerDay', 'R$ por dia', 'Comparação');
    }
    path('hourlyValue', 'Quanto vale uma hora do seu tempo?', 'globals.ownerHourlyValue', 'R$ por hora', 'Comparação', { help: 'Não é uma despesa paga. Permite comparar o retorno econômico de estratégias que exigem trabalhos diferentes.' });
    choice('horizon', 'Por quanto tempo quer comparar os cenários?', [['1', '1 ano'], ['3', '3 anos'], ['5', '5 anos']], 'Comparação');
    path('inflation', 'Qual a inflação anual esperada?', 'globals.inflationPct', '% ao ano', 'Comparação', { min: -99 });
    if (!c.rented) path('appreciation', 'Quanto o imóvel deve valorizar acima da inflação?', 'globals.propertyRealAppreciationPct', '% ao ano, em termos reais', 'Comparação', { min: -99, help: 'Zero significa acompanhar a inflação. A valorização nominal é calculada pelo motor.' });
    path('investmentRate', 'Qual o rendimento bruto esperado da aplicação financeira?', 'investment.nominalRatePct', '% ao ano, nominal', 'Comparação', { help: 'O benchmark financeiro faz parte da análise de custo de oportunidade mesmo sem um card de investimento. A referência de 13,65% é de outubro de 2026, não uma cotação atualizada.' });
    path('investmentTax', 'Qual o imposto sobre os rendimentos da aplicação?', 'investment.taxPct', '% dos rendimentos', 'Comparação', { max: 100 });
    path('investmentFees', 'Quais são os custos anuais da aplicação?', 'investment.feesPct', '% do capital por ano', 'Comparação', { max: 100 });
    if (!c.rented && !c.buy) {
      path('brokerage', 'Qual a corretagem esperada na venda do imóvel?', 'propertySale.brokeragePct', '% da venda', 'Comparação', { max: 100, help: 'A venda líquida também define o benchmark de custo de oportunidade, mesmo se você não exibir o card do investimento.' });
      path('saleFixed', 'Quanto custam os documentos e demais despesas da venda?', 'propertySale.fixedCosts', 'R$', 'Comparação');
      path('mortgageBalance', 'Qual o saldo de financiamento a quitar na venda?', 'propertySale.mortgageBalance', 'R$', 'Comparação', { help: 'Para imóvel já possuído, este campo representa a quitação na venda; o motor não projeta suas parcelas atuais.' });
      path('capitalGains', 'Qual o imposto estimado sobre o ganho de capital na venda?', 'propertySale.capitalGainsTax', 'R$', 'Comparação');
    }
    qs.push({ id: 'name', title: 'Como quer chamar esta simulação?', type: 'text', phase: 'Comparação', defaultValue: 'Minha simulação', maxLength: 120 });
    return qs;
  }

  function valueFor(q, answers) { return own(answers, q.id) ? answers[q.id] : q.defaultValue; }
  function validation(q, value) {
    if (q.type === 'summary') return '';
    if (q.type === 'choice') return q.options.some(x => x[0] === value) ? '' : 'Escolha uma opção para continuar.';
    if (q.type === 'text') return String(value || '').trim() ? '' : 'Dê um nome à simulação.';
    if (value === '' || value == null || !Number.isFinite(Number(value))) return 'Informe um número válido ou use a referência.';
    const v = Number(value);
    if (v < q.min || (q.max != null && v > q.max)) return `Informe um valor ${q.max != null ? `entre ${num.format(q.min)} e ${num.format(q.max)}` : `maior ou igual a ${num.format(q.min)}`}.`;
    if (q.step === 1 && !Number.isInteger(v)) return 'Informe um número inteiro.';
    return '';
  }

  function buildPreset(answers, confirmed = []) {
    const sim = api(), c = context(answers), qs = questions(answers);
    const errors = qs.flatMap(q => { const error = validation(q, valueFor(q, answers)); return error ? [{ questionId: q.id, message: `${q.title} ${error}` }] : []; });
    if (c.hybrid) {
      const useQuestions = qs.filter(q => q.id.startsWith('use_'));
      if (useQuestions.reduce((sum, q) => sum + Number(valueFor(q, answers) || 0), 0) <= 0) {
        errors.push({ questionId: useQuestions[0].id, message: 'Você escolheu usar o imóvel. Reserve ao menos um dia para seu uso ou volte e selecione o uso exclusivo para renda.' });
      }
    }
    if (c.airbnb && answers.seasonMode === 'detail' && answers.occupancyBasis === 'admin') {
      const deltaQ = qs.find(q => q.id === 'managementDelta');
      const delta = Number(valueFor(deltaQ, answers));
      for (const q of qs.filter(q => q.id.startsWith('occupancy_'))) {
        if (Number(valueFor(q, answers)) < delta) errors.push({ questionId: q.id, message: `${q.title} A ocupação administrada não pode ser menor que o ganho de ${num.format(delta)} p.p. configurado. Reduza o ganho esperado ou ajuste a ocupação.` });
      }
    }
    let next = clone(sim.defaultState);
    // A identidade e os comparáveis do imóvel-base não pertencem ao novo imóvel.
    next.market.comparables = [];
    next.market.evidenceSnapshot = null;
    next.market.subject = { address: '', neighborhood: '', propertyType: 'apartment', roomType: 'entire_home', areaM2: 0, bedrooms: 0, bathrooms: 0, guests: 0, beds: 0, acUnits: 0, elevator: 'unknown', parking: 'unknown', qualityGrade: 0, minStayNights: 0 };
    for (const q of qs) {
      if (q.type !== 'number' || q.target.profile) continue;
      const val = valueFor(q, answers);
      if (!validation(q, val)) setTarget(next, q.target, Number(val) / (q.scale || 1));
    }
    next.name = String(answers.name || 'Minha simulação').trim();
    next.airbnb.occupancyInputBasis = c.airbnb && answers.seasonMode === 'detail' && answers.occupancyBasis === 'admin' ? 'admin' : 'self';
    if (next.airbnb.occupancyInputBasis === 'admin') {
      for (const x of next.seasons) x.occupancyPct = sim.selfOccupancyPctFromInput(x.occupancyPct, next);
    }
    next.rentedAirbnb.furnished = c.rented && answers.furnished === 'yes';
    next.rentedAirbnb.subleaseAuthorized = c.rented && answers.subleaseAuthorized === 'yes';
    for (const x of next.monthlyCosts) {
      if (['condominio', 'iptu', 'tcl'].includes(x.id)) {
        x.traditional = c.traditional && answers.traditionalCharges === 'owner';
        if (c.rented) x.rentedAirbnb = answers.rentedCharges === 'all' || (x.id === 'condominio' && answers.rentedCharges !== 'utilities');
      }
      if (x.id === 'tcl') x.name = 'TCL — coleta de lixo';
    }
    for (const x of next.setupCosts) {
      if (!c.airbnb || answers.preparation === 'none') { x.amount = 0; x.rentedAmount = 0; }
    }
    // Perfis independentes reaproveitam os mesmos presets e patches do editor existente.
    for (const plan of ['essential', 'premium']) {
      if (!(plan === 'essential' ? c.essential : c.premium)) continue;
      const draft = sim.adminWizardPresetDraft(plan, next);
      draft.commissionPct = Number(answers[plan === 'essential' ? 'commissionEssential' : 'commissionPremium'] ?? draft.commissionPct);
      draft.supervisionHoursMonthly = next.work.supervisionAdminHoursMonthly;
      next = sim.applyWizardPatch(next, sim.buildAdminWizardPatch(draft, next));
    }
    if (c.buy) {
      if (answers.financing !== 'yes') for (const key of ['financingPrincipal', 'financingAnnualRatePct', 'financingOriginationCosts']) next.guidedSetup.acquisitionSale[key] = 0;
      if (answers.additionalEquity !== 'yes') next.guidedSetup.acquisitionSale.additionalEquity = 0;
      const d = { ...next.guidedSetup.acquisitionSale, position: 'buy', currentMarketValue: next.globals.propertyValue,
        ...next.propertySale, workingCapitalTarget: c.airbnb ? (c.self ? 'airbnbSelf' : 'airbnbAdmin') : 'traditional' };
      d.workingCapitalAmount = next.workingCapital[d.workingCapitalTarget];
      // Verifica a maior reserva de giro selecionada, sem somá-la entre cenários alternativos.
      if (c.self && c.admin) d.workingCapitalAmount = Math.max(next.workingCapital.airbnbSelf, next.workingCapital.airbnbAdmin);
      for (const x of next.setupCosts) d[`setup_${x.id}`] = x.amount;
      const patch = sim.buildPropertyWizardPatch(d, next);
      errors.push(...patch.errors.map(message => ({ questionId: 'availableCapital', message })));
      const workingCapital = clone(next.workingCapital);
      next = sim.applyWizardPatch(next, patch);
      next.workingCapital = workingCapital;
    }
    const selected = scenarioIds(answers);
    const main = { situation: c.buy ? 'capital-buy' : c.rented ? 'rent-third-party' : 'owned', horizonYears: Number(answers.horizon || 3) };
    for (const id of Object.keys(labels)) main[`scenario_${id}`] = selected.includes(id);
    const mainPatch = sim.buildMainWizardPatch(main, next);
    if (!c.buy) errors.push(...mainPatch.errors.map(message => ({ questionId: 'situation', message })));
    next = sim.applyWizardPatch(next, mainPatch);
    next.guidedSetup.main.enabledScenarios = selected;
    next.guidedSetup.main.exactScenarioSelection = true;
    if (c.hybrid) next.guidedSetup.hybrid = { configured: true, granularity: 'annual-periods' };
    const confirmedSet = new Set(confirmed);
    next.guidedSetup.preset = { configured: true, flowVersion: 1, answers: clone(answers),
      fields: qs.filter(q => q.type === 'number').map(q => ({ id: q.id, title: q.title, value: Number(valueFor(q, answers)), unit: q.unit,
        source: !confirmedSet.has(q.id) ? 'reference' : Number(valueFor(q, answers)) === q.defaultValue ? 'confirmed-reference' : 'entered' })),
      referenceContext: 'Referências do cenário-base Rio/outubro de 2026; valores editáveis, sem consulta de mercado automática.' };
    return { state: sim.normalizeState(next), errors, questions: qs, selected };
  }

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  function display(q, value) {
    if (q.type === 'choice') return q.options.find(x => x[0] === value)?.[1] || '—';
    if (q.type === 'number') return `${q.unit.startsWith('R$') ? brl.format(value) : num.format(value)} ${q.unit.replace(/^R\$\s*/, '')}`.trim();
    return String(value ?? '');
  }

  function init(hooks) {
    const dialog = document.querySelector('#presetDialog');
    if (!dialog) return;
    const form = dialog.querySelector('form'), body = dialog.querySelector('#presetBody');
    const title = dialog.querySelector('#presetTitle'), help = dialog.querySelector('#presetHelp');
    const progress = dialog.querySelector('#presetProgress'), actions = dialog.querySelector('#presetActions');
    let session = null;
    const button = (action, text, primary = false) => `<button type="button" class="button ${primary ? 'primary' : 'secondary'}" data-preset-action="${action}">${text}</button>`;
    const currentQuestions = () => questions(session.answers);
    const currentQuestion = () => currentQuestions()[session.index];
    const listScenarios = a => `<ul class="preset-scenarios">${scenarioIds(a).map(id => `<li>${esc(labels[id])}</li>`).join('')}</ul>`;
    const error = message => { const el = dialog.querySelector('#presetError'); el.textContent = message; el.hidden = !message; };
    const fieldValue = () => {
      const q = currentQuestion();
      if (q.type === 'summary') return undefined;
      return q.type === 'choice' ? body.querySelector('input:checked')?.value : body.querySelector('input')?.value;
    };
    function capture(requireValid) {
      const q = currentQuestion(), raw = fieldValue();
      const message = validation(q, raw);
      if (requireValid && message) { error(message); body.querySelector('input')?.focus(); return false; }
      if (q.type !== 'summary' && raw !== undefined) {
        session.answers[q.id] = q.type === 'number' && raw !== '' ? Number(raw) : raw;
        if (!message) session.confirmed.add(q.id);
      }
      return true;
    }
    function render() {
      if (!session) return;
      error('');
      body.scrollTop = 0;
      if (session.stage === 'intro') {
        body.dataset.questionId = 'intro';
        title.textContent = 'Vamos criar uma nova simulação';
        help.textContent = 'Uma pergunta por vez, somente sobre o que faz sentido para você.';
        progress.textContent = 'Antes de começar';
        body.innerHTML = `<p>Sua simulação atual, <strong>${esc(hooks.getState().name)}</strong>, será substituída quando você concluir.</p><p>Você pode baixar uma cópia agora para carregá-la novamente depois.</p><p class="helper">Durante as perguntas, sua configuração atual permanece intacta. Fechar ou cancelar descarta apenas o novo rascunho.</p>`;
        actions.innerHTML = button('cancel', 'Cancelar') + button('start', 'Começar sem baixar') + button('download-start', 'Baixar atual e começar', true);
      } else if (session.stage === 'review') {
        renderReview();
      } else {
        const qs = currentQuestions(), q = qs[session.index], v = valueFor(q, session.answers);
        body.dataset.questionId = q.id;
        title.textContent = q.title;
        help.textContent = q.help || (q.type === 'number' ? 'Use a referência ou ajuste o valor para sua realidade.' : 'Escolha uma opção para continuar.');
        const phaseIndex = phases.indexOf(q.phase);
        progress.innerHTML = `<span>Etapa ${phaseIndex + 1} de ${phases.length} · ${esc(q.phase)}</span><span>Pergunta ${session.index + 1} de ${qs.length}</span><progress max="${qs.length}" value="${session.index + 1}" aria-label="Progresso da configuração"></progress>`;
        if (q.type === 'choice') body.innerHTML = `<fieldset class="preset-options"><legend class="sr-only">${esc(q.title)}</legend>${q.options.map(([value, label, detail]) => `<label class="preset-option"><input type="radio" name="presetAnswer" value="${esc(value)}" ${v === value ? 'checked' : ''}><span><strong>${esc(label)}</strong>${detail ? `<small>${esc(detail)}</small>` : ''}</span></label>`).join('')}</fieldset>`;
        else if (q.type === 'summary') body.innerHTML = listScenarios(session.answers) + (context(session.answers).rented ? '<p class="helper">O benchmark financeiro compara o capital comprometido na operação; não pressupõe a venda de um imóvel seu.</p>' : '');
        else body.innerHTML = `<label class="preset-value-label" for="presetValue">${esc(q.type === 'number' ? q.unit : 'Nome da simulação')}</label><input class="preset-value" id="presetValue" type="${q.type === 'number' ? 'number' : 'text'}" value="${esc(v)}" ${q.type === 'number' ? `min="${q.min}" ${q.max != null ? `max="${q.max}"` : ''} step="${q.step}" inputmode="decimal"` : 'maxlength="120"'} aria-describedby="presetHelp presetError" required>${q.type === 'number' ? `<div class="preset-reference"><span>Referência: ${esc(display(q, q.defaultValue))}</span>${button('reference', 'Usar referência')}</div>` : ''}`;
        actions.innerHTML = button('back', 'Voltar') + button('cancel', 'Cancelar') + `<button type="submit" class="button primary">${session.returnToReview ? 'Salvar e revisar' : 'Continuar'}</button>`;
      }
      const focus = session.stage === 'questions' ? body.querySelector('#presetValue') : null;
      (focus || title).focus({ preventScroll: true });
      if (focus) focus.select();
    }
    function renderReview() {
      body.dataset.questionId = 'review';
      const built = buildPreset(session.answers, [...session.confirmed]), next = built.state;
      session.reviewQuestionIds = built.questions.map(q => q.id);
      title.textContent = 'Revise sua nova simulação';
      help.textContent = 'Confira as escolhas e os valores. Sua simulação atual só será substituída ao clicar em Criar simulação.';
      progress.textContent = 'Revisão final';
      const groups = phases.map(phase => {
        const rows = built.questions.filter(q => q.phase === phase && q.type !== 'summary').map(q => {
          const v = valueFor(q, session.answers);
          const reference = q.type === 'number' ? !session.confirmed.has(q.id) ? 'Referência mantida' : Number(v) === q.defaultValue ? 'Referência confirmada' : 'Informado por você' : '';
          return `<div class="preset-review-row"><div><span>${esc(q.title)}</span><strong>${esc(display(q, v))}</strong>${reference ? `<small>${reference}</small>` : ''}</div><button type="button" class="button tiny secondary" data-preset-edit="${esc(q.id)}">Editar<span class="sr-only"> ${esc(q.title)}</span></button></div>`;
        }).join('');
        return `<details class="preset-review-group" ${phase === 'Seu objetivo' ? 'open' : ''}><summary>${esc(phase)}</summary>${rows}</details>`;
      }).join('');
      const c = context(session.answers);
      const seasonal = c.airbnb ? `<h4>Sazonalidade aplicada</h4><ul>${next.seasons.map(x => `<li>${esc(x.name)}: ${brl.format(x.nightlyRate)}/noite · ${num.format(x.occupancyPct)}% autogestão · ${num.format(x.personalUseDays + x.habitualUseDays)} dias de uso próprio</li>`).join('')}</ul>` : '';
      const setup = c.airbnb ? `<h4>Preparação e valor residual</h4><ul>${next.setupCosts.filter(x => !c.rented || !next.rentedAirbnb.furnished || !x.rentedOnlyIfUnfurnished).map(x => `<li>${esc(x.name)}: ${brl.format(c.rented ? x.rentedAmount : x.amount)} · residual ${num.format(x.residualPct)}%</li>`).join('')}</ul>` : '';
      const additional = `<h4>Custos recorrentes e tempo de referência</h4><ul>${next.monthlyCosts.filter(x => c.rented ? x.rentedAirbnb : (c.airbnb && x.airbnb) || (c.traditional && x.traditional) || (session.answers.idle === 'yes' && x.idleProperty)).map(x => `<li>${esc(x.name)}: ${brl.format(x.amount)}/mês${c.self ? ` · ${num.format(x.ownerHoursMonthly)} h/mês próprias` : ''}</li>`).join('')}</ul>${c.airbnb ? `<p>Manutenção/perdas: ${next.percentageCosts.map(x => `${esc(x.name)} ${num.format(x.pct)}%`).join('; ')}. Fundo de reposição: ${num.format(next.reserveFunds[0].pct)}%; saldo ${brl.format(next.reserveFunds[0].openingBalance)}. Capital de giro: autogestão ${brl.format(next.workingCapital.airbnbSelf)}, administradora ${brl.format(next.workingCapital.airbnbAdmin)}, imóvel alugado ${brl.format(next.workingCapital.rentedAirbnb)}.</p>` : ''}`;
      body.innerHTML = listScenarios(session.answers) + (built.errors.length ? `<div class="notice warning"><strong>Precisamos ajustar antes de criar:</strong>${built.errors.map(e => `<p>${esc(e.message)} <button type="button" class="button tiny secondary" data-preset-edit="${esc(e.questionId)}">Corrigir</button></p>`).join('')}</div>` : '') +
        (c.rented && session.answers.subleaseAuthorized !== 'yes' ? '<p class="notice warning">Autorização contratual para temporada ainda pendente. O simulador permite avaliar a hipótese, mas não considera a autorização confirmada.</p>' : '') +
        '<p class="preset-reference-note">Referências: cenário-base Rio/outubro de 2026. IPTU, taxas, preços e custos precisam corresponder ao seu imóvel. Não foi feita uma pesquisa automática de mercado.</p>' + groups +
        `<details class="preset-review-group"><summary>Referências adicionais e regras mantidas</summary>${seasonal}${setup}${additional}<p>Fim do horizonte: continuar a estratégia. Aluguel tradicional: comissão de nova locação de ${num.format(next.traditional.newLeaseCommissionMonths)} aluguel a cada ${num.format(next.traditional.avgContractMonths)} meses; manutenção ${num.format(next.traditional.maintenancePct)}%; perdas ${num.format(next.traditional.lossPct)}%. Trabalho do investimento: ${num.format(next.work.investmentHoursMonthly)} h/mês. Benefícios de consumo não são receita. A tributação usa a base e as despesas dedutíveis marcadas no modelo.</p><p>Os controles detalhados e assistentes continuam disponíveis depois da criação.</p></details>`;
      actions.innerHTML = button('back', 'Voltar') + button('cancel', 'Cancelar') + `<button type="button" class="button primary" data-preset-action="apply" ${built.errors.length ? 'disabled' : ''}>Criar simulação</button>`;
    }
    function start() { session.stage = 'questions'; session.index = 0; render(); }
    dialog.addEventListener('click', event => {
      const edit = event.target.closest('[data-preset-edit]');
      if (edit) {
        const index = currentQuestions().findIndex(q => q.id === edit.dataset.presetEdit);
        if (index >= 0) { session.index = index; session.stage = 'questions'; session.returnToReview = true; render(); }
        return;
      }
      const action = event.target.closest('[data-preset-action]')?.dataset.presetAction;
      if (!action || !session) return;
      if (action === 'cancel') { dialog.close(); return; }
      if (action === 'start') start();
      if (action === 'download-start') {
        try { hooks.exportCurrent(); start(); } catch { error('Não foi possível iniciar o download. Tente novamente ou escolha começar sem baixar.'); }
      }
      if (action === 'reference') { body.querySelector('#presetValue').value = currentQuestion().defaultValue; body.querySelector('#presetValue').focus(); }
      if (action === 'back') {
        if (session.stage === 'review') { session.stage = 'questions'; session.index = currentQuestions().length - 1; session.returnToReview = false; }
        else { capture(false); session.returnToReview = false; if (session.index === 0) session.stage = 'intro'; else session.index--; }
        render();
      }
      if (action === 'apply') {
        const built = buildPreset(session.answers, [...session.confirmed]);
        if (built.errors.length) { render(); return; }
        hooks.applyState(built.state);
        dialog.close();
      }
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!session || session.stage !== 'questions' || !capture(true)) return;
      const qs = currentQuestions();
      if (session.returnToReview) {
        // Uma escolha de perfil editada pode introduzir perguntas novas obrigatórias.
        const firstMissing = qs.findIndex(q => !session.reviewQuestionIds.includes(q.id) || (q.type === 'choice' && validation(q, valueFor(q, session.answers))));
        if (firstMissing >= 0) { session.index = firstMissing; session.returnToReview = false; }
        else { session.stage = 'review'; session.returnToReview = false; }
      } else if (session.index < qs.length - 1) session.index++;
      else session.stage = 'review';
      render();
    });
    dialog.addEventListener('close', () => { session = null; });
    document.querySelector('#openPresetSetup')?.addEventListener('click', () => {
      session = { answers: {}, confirmed: new Set(), index: 0, stage: 'intro', returnToReview: false };
      dialog.showModal(); render();
    });
  }
  window.GuidedPreset = { context, scenarioIds, questions, valueFor, validation, buildPreset, init };
})();
