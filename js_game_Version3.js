// --- DOM Elements ---
const DOMElements = {
    startScreen: document.getElementById('startScreen'),
    gameScreen: document.getElementById('gameScreen'),
    resultScreen: document.getElementById('resultScreen'),
    progressBar: document.getElementById('progressBar'),
    currentScenarioDisplay: document.getElementById('currentScenario'),
    totalScenariosDisplay: document.getElementById('totalScenarios'),
    timerDisplay: document.getElementById('timerDisplay'),
    scenarioIcon: document.getElementById('scenarioIcon'),
    scenarioTitle: document.getElementById('scenarioTitle'),
    scenarioText: document.getElementById('scenarioText'),
    choicesContainer: document.getElementById('choicesContainer'),
    metricsContainer: document.getElementById('metricsContainer'),
    powerUpContainer: document.querySelector('.power-ups'),
    hintMessage: document.getElementById('hintMessage'),
    finalScore: document.getElementById('finalScore'),
    resultCategory: document.getElementById('resultCategory'),
    resultDescription: document.getElementById('resultDescription'),
    scoreBreakdown: document.getElementById('scoreBreakdown'),
    modalOverlay: document.getElementById('modalOverlay'),
    modal: document.getElementById('modal'),
    feedbackTitle: document.getElementById('feedbackTitle'),
    feedbackText: document.getElementById('feedbackText'),
    impactList: document.getElementById('impactList'),
    modalContinueBtn: document.getElementById('modalContinueBtn'),
};

// --- Game Configuration ---
const CONFIG = {
    initialMetrics: {
        chiffreAffaires: { name: "Chiffre d'Affaires", icon: "📈", value: 150000000, isCurrency: true },
        couts: { name: "Coûts", icon: "📉", value: 135000000, isCurrency: true },
        marge: { name: "Marge", icon: "📊", value: 10, isPercentage: true },
        delais: { name: "Délais", icon: "⏱️", value: 80 },
        qualite: { name: "Qualité", icon: "⭐", value: 80 },
        securite: { name: "Sécurité", icon: "🛡️", value: 80 },
        client: { name: "Client", icon: "🤝", value: 80 },
        equipe: { name: "Équipe", icon: "👥", value: 80 },
    },
    initialPowerUps: {
        audit: { name: "Audit Financier", icon: "💸", count: 1, description: "Révèle les impacts financiers exacts de chaque choix." },
        negociation: { name: "Négociation", icon: "🗣️", count: 1, description: "Permet de réduire un impact négatif majeur." },
        xray: { name: "Analyse Risques", icon: "🔍", count: 1, description: "Surligne le choix le moins dommageable pour le projet." },
    },
    timeBonusThreshold: 20,
    timeBonusPoints: 50,
};

// --- Game State ---
let state = {};

// --- Scenarios Data (Expert Mode) ---
const scenarios = [
    {
        title: "Défaillance Fournisseur Critique", icon: "🏭", timeLimit: 45,
        text: "Votre fournisseur principal de béton préfabriqué, crucial pour la phase actuelle, vient de déposer le bilan. Le chantier risque d'être à l'arrêt complet d'ici 48h.",
        choices: [
            { text: "Signer avec un fournisseur local plus cher en urgence", impacts: { couts: 750000, delais: 5, qualite: -5, client: 10 }, feedback: "Vous sauvez les délais mais le surcoût est important et la qualité de ce fournisseur est moins réputée. Le client apprécie votre réactivité." },
            { text: "Lancer un appel d'offres accéléré (1 semaine)", impacts: { couts: 250000, delais: -15, equipe: -10, client: -5 }, feedback: "Solution financièrement prudente, mais une semaine d'arrêt pèse sur les délais et le moral de l'équipe." },
            { text: "Utiliser une technologie alternative (béton coulé sur place)", impacts: { couts: 1200000, securite: -10, qualite: 10, delais: -5 }, feedback: "Innovant mais très coûteux et techniquement risqué. La qualité pourrait être supérieure, si tout se passe bien." },
            { text: "Tenter de racheter le stock du fournisseur défaillant via l'administrateur judiciaire", impacts: { couts: -100000, delais: -10, client: -10, securite: -5 }, feedback: "Un pari audacieux. Si ça marche, vous faites une bonne affaire. Si ça échoue, vous perdez un temps précieux. C'est un risque juridique." }
        ]
    },
    {
        title: "Conflit Social", icon: "🔥", timeLimit: 60,
        text: "Une grève surprise éclate sur le chantier suite à un désaccord sur les conditions de travail. Le piquet de grève bloque l'accès au site. La presse locale est déjà là.",
        choices: [
            { text: "Négocier immédiatement avec les syndicats, quitte à céder sur des primes", impacts: { couts: 500000, equipe: 15, delais: 5, client: -5 }, feedback: "Le conflit est résolu rapidement, l'équipe est satisfaite, mais cela crée un précédent coûteux pour l'avenir." },
            { text: "Faire appel à un huissier pour constater le blocage et menacer d'actions légales", impacts: { equipe: -25, delais: -15, client: -10, securite: -5 }, feedback: "La ligne dure. Vous envenimez les relations sociales et risquez un arrêt prolongé. L'image du projet en pâtit." },
            { text: "Organiser une table ronde avec la direction, les syndicats et un médiateur", impacts: { delais: -5, equipe: 5, couts: 50000 }, feedback: "Approche diplomatique mais lente. Montre votre volonté de dialogue, mais chaque jour de négociation est un jour de retard." },
            { text: "Ignorer le piquet et tenter de faire entrer des non-grévistes par une autre entrée", impacts: { securite: -30, equipe: -20, delais: -20, qualite: -15 }, feedback: "Extrêmement dangereux. Vous risquez l'escalade, des accidents et des défauts de qualité catastrophiques. Une très mauvaise décision." }
        ]
    },
    {
        title: "Modification Majeure du Client", icon: "✍️", timeLimit: 50,
        text: "À mi-projet, le client demande une modification de conception majeure qui impacte la structure porteuse. Il souhaite que cela soit inclus dans le budget initial.",
        choices: [
            { text: "Refuser catégoriquement en citant le contrat", impacts: { client: -25, equipe: 5 }, feedback: "Vous êtes dans votre droit, mais la relation client est durablement endommagée. Cela pourrait compliquer la réception du chantier." },
            { text: "Accepter, en espérant vous rattraper sur d'autres postes", impacts: { couts: 1500000, client: 15, qualite: -10, equipe: -10 }, feedback: "Geste commercial très apprécié mais qui anéantit votre marge. L'équipe est démotivée par ce travail 'gratuit'." },
            { text: "Chiffrer un avenant détaillé (coûts + marge) et le défendre fermement", impacts: { chiffreAffaires: 1800000, couts: 1500000, client: 5, delais: -5 }, feedback: "La seule approche professionnelle. La négociation sera tendue mais vous préservez votre marge et la rigueur du projet." },
            { text: "Proposer une alternative moins chère qui répond partiellement au besoin", impacts: { client: -5, qualite: -5, couts: 400000 }, feedback: "Un compromis qui ne satisfait personne. Le client se sent floué et la solution technique est sous-optimale." }
        ]
    },
    {
        title: "Problème Géotechnique Imprévu", icon: "⛰️", timeLimit: 40,
        text: "Les fondations révèlent une poche d'argile non détectée par les études de sol initiales. La stabilité d'une aile du bâtiment est compromise.",
        choices: [
            { text: "Mettre en place des fondations spéciales (micropieux)", impacts: { couts: 2000000, delais: -15, securite: 20 }, feedback: "La solution la plus sûre et la plus pérenne, mais son coût est exorbitant et impacte lourdement les délais." },
            { text: "Réaliser une injection de résine pour stabiliser le sol", impacts: { couts: 800000, delais: -5, securite: 5, qualite: -5 }, feedback: "Une solution technique plus rapide et moins chère, mais dont la durabilité à long terme est sujette à débat. Un risque calculé." },
            { text: "Alléger la structure du bâtiment concerné pour réduire la charge", impacts: { qualite: -15, client: -10, couts: 250000 }, feedback: "Vous traitez le symptôme, pas la cause. Le client n'apprécie pas la réduction de la qualité et la sécurité reste une préoccupation." },
            { text: "Mettre en cause le bureau d'études géotechniques pour prise en charge", impacts: { delais: -25, client: -15, couts: 100000 }, feedback: "Vous lancez une bataille juridique qui paralysera le projet pendant des mois. Les chances de succès sont incertaines." }
        ]
    },
];
// Duplique pour arriver à 10 scénarios
while (scenarios.length < 10) {
    scenarios.push(...scenarios.slice(0, 10 - scenarios.length));
}

function formatCurrency(value) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function initializeGame() {
    state = {
        currentScenarioIndex: 0,
        score: 0,
        metrics: JSON.parse(JSON.stringify(CONFIG.initialMetrics)),
        powerUps: JSON.parse(JSON.stringify(CONFIG.initialPowerUps)),
        timerInterval: null,
        timeLeft: 0,
        isModalOpen: false,
        auditActive: false,
    };
    recalculateMargin();
}

function recalculateMargin() {
    const ca = state.metrics.chiffreAffaires.value;
    const costs = state.metrics.couts.value;
    if (ca > 0) {
        state.metrics.marge.value = ((ca - costs) / ca) * 100;
    } else {
        state.metrics.marge.value = 0;
    }
}

function startGame() {
    initializeGame();

    // Fade out start screen
    DOMElements.startScreen.classList.remove('opacity-100', 'scale-100');
    DOMElements.startScreen.classList.add('opacity-0', 'scale-95');
    // After transition, move it to the back
    setTimeout(() => {
        DOMElements.startScreen.classList.remove('z-30');
        DOMElements.startScreen.classList.add('-z-10');
    }, 500); // Match CSS transition duration

    // Fade in game screen
    DOMElements.gameScreen.classList.remove('opacity-0', '-z-10', 'scale-95');
    DOMElements.gameScreen.classList.add('opacity-100', 'z-10', 'scale-100');

    DOMElements.totalScenariosDisplay.textContent = scenarios.length;
    renderAll();
    loadScenario(state.currentScenarioIndex);
}

function restartGame() {
    // Fade out result screen
    DOMElements.resultScreen.classList.remove('opacity-100', 'scale-100');
    DOMElements.resultScreen.classList.add('opacity-0', 'scale-95');
     // After transition, move it to the back
    setTimeout(() => {
        DOMElements.resultScreen.classList.remove('z-10');
        DOMElements.resultScreen.classList.add('-z-10');
    }, 500);

    // Fade in start screen
    DOMElements.startScreen.classList.remove('opacity-0', '-z-10', 'scale-95');
    DOMElements.startScreen.classList.add('opacity-100', 'z-30', 'scale-100');
}

function loadScenario(index) {
    state.auditActive = false; // Reset audit on new scenario
    if (index >= scenarios.length) {
        endGame();
        return;
    }
    state.currentScenarioIndex = index;
    DOMElements.choicesContainer.querySelectorAll('.highlight-choice').forEach(el => el.classList.remove('highlight-choice'));
    DOMElements.hintMessage.classList.remove('opacity-100', 'translate-y-0');
    DOMElements.currentScenarioDisplay.textContent = index + 1;
    DOMElements.progressBar.style.width = `${((index + 1) / scenarios.length) * 100}%`;
    DOMElements.scenarioIcon.textContent = scenarios[index].icon;
    DOMElements.scenarioTitle.textContent = scenarios[index].title;
    DOMElements.scenarioText.textContent = scenarios[index].text;
    renderChoices(scenarios[index].choices);
    startTimer(scenarios[index].timeLimit);
}

function handleChoice(choiceIndex) {
    if (state.isModalOpen) return;
    clearInterval(state.timerInterval);

    const scenario = scenarios[state.currentScenarioIndex];
    const choice = scenario.choices[choiceIndex];
    const impacts = choice.impacts;

    for (const key in impacts) {
        updateMetric(key, impacts[key]);
    }
    recalculateMargin();

    if (state.timeLeft >= CONFIG.timeBonusThreshold) {
        state.score += CONFIG.timeBonusPoints;
    }

    showFeedbackModal(choice, impacts);
}

function updateMetric(key, change) {
    const metric = state.metrics[key];
    if (!metric) return;

    if (metric.isCurrency || metric.isPercentage) {
         metric.value += change;
    } else {
        metric.value = Math.max(0, Math.min(100, metric.value + change));
    }

    renderMetric(key);
    showMetricChangeIndicator(key, change, metric.isCurrency);
}

function startTimer(duration) {
    state.timeLeft = duration;
    clearInterval(state.timerInterval);
    const update = () => {
        DOMElements.timerDisplay.textContent = `⏱️ 0:${state.timeLeft.toString().padStart(2, '0')}`;
        DOMElements.timerDisplay.classList.toggle('text-red-500', state.timeLeft <= 10);
        DOMElements.timerDisplay.classList.toggle('critical-time', state.timeLeft <= 10);
        DOMElements.timerDisplay.classList.toggle('text-amber-400', state.timeLeft > 10);
        if (state.timeLeft <= 0) {
            clearInterval(state.timerInterval);
            handleChoice(Math.floor(Math.random() * scenarios[state.currentScenarioIndex].choices.length));
        }
        state.timeLeft--;
    };
    update();
    state.timerInterval = setInterval(update, 1000);
}

function usePowerUp(type) {
    if (state.powerUps[type].count <= 0 || state.isModalOpen) return;
    state.powerUps[type].count--;

    switch (type) {
        case 'audit':
            state.auditActive = true;
            renderChoices(scenarios[state.currentScenarioIndex].choices);
            DOMElements.hintMessage.textContent = "Audit activé : Impacts financiers révélés.";
            DOMElements.hintMessage.classList.add('opacity-100', 'translate-y-0');
            break;
        case 'negociation':
            updateMetric('client', 15);
            DOMElements.hintMessage.textContent = "Négociation réussie ! La satisfaction client augmente.";
            DOMElements.hintMessage.classList.add('opacity-100', 'translate-y-0');
            break;
        case 'xray':
            const bestChoiceElement = document.getElementById(`choice-${findBestChoice().index}`);
            if (bestChoiceElement) {
                bestChoiceElement.classList.add('highlight-choice');
            }
            break;
    }
    setTimeout(() => { DOMElements.hintMessage.classList.remove('opacity-100', 'translate-y-0'); }, 4000);
    renderPowerUps();
}

function findBestChoice() {
    const choices = scenarios[state.currentScenarioIndex].choices;
    let bestScore = -Infinity;
    let bestIndex = -1;
    choices.forEach((choice, index) => {
        const score = Object.values(choice.impacts).reduce((sum, val) => sum + val, 0);
        if (score > bestScore) {
            bestScore = score;
            bestIndex = index;
        }
    });
    return { ...choices[bestIndex], index: bestIndex };
}

function showFeedbackModal(choice, impacts) {
    state.isModalOpen = true;
    DOMElements.feedbackTitle.textContent = choice.text ? `Conséquences de la décision` : "Rapport de situation";
    DOMElements.feedbackText.textContent = choice.feedback;

    let impactHTML = '';
    for (const key in impacts) {
        const change = impacts[key];
        const metric = CONFIG.initialMetrics[key];
        const isFinancial = metric.isCurrency || key === 'marge';
        const colorClass = change > 0 ? (key === 'couts' ? 'text-red-400' : 'text-green-400') : (key === 'couts' ? 'text-green-400' : 'text-red-400');
        const sign = change > 0 ? '+' : '';
        const value = isFinancial ? formatCurrency(change) : `${sign}${change}`;

        impactHTML += `
            <div class="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                <span class="font-medium">${metric.icon} ${metric.name}</span>
                <span class="font-bold ${colorClass}">${value}</span>
            </div>
        `;
    }
    DOMElements.impactList.innerHTML = impactHTML;

    DOMElements.modalOverlay.classList.remove('pointer-events-none', 'opacity-0');
    DOMElements.modal.classList.remove('scale-95');

    DOMElements.modalContinueBtn.onclick = () => {
        closeFeedbackModal();
        loadScenario(state.currentScenarioIndex + 1);
    };
}

function closeFeedbackModal() {
    state.isModalOpen = false;
    DOMElements.modalOverlay.classList.add('pointer-events-none', 'opacity-0');
    DOMElements.modal.classList.add('scale-95');
}

function endGame() {
    // Fade out game screen
    DOMElements.gameScreen.classList.remove('opacity-100', 'scale-100');
    DOMElements.gameScreen.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        DOMElements.gameScreen.classList.remove('z-10');
        DOMElements.gameScreen.classList.add('-z-10');
    }, 500);

    // Fade in result screen
    DOMElements.resultScreen.classList.remove('opacity-0', '-z-10', 'scale-95');
    DOMElements.resultScreen.classList.add('opacity-100', 'z-10', 'scale-100');

    const finalMargin = state.metrics.marge.value;
    const totalScore = Math.round(finalMargin * 1000 + state.metrics.client.value * 50 + state.metrics.qualite.value * 50);
    DOMElements.finalScore.textContent = totalScore;

    let category, description;
    if (finalMargin >= 10) {
        category = "Maître d'Œuvre d'Exception";
        description = "Rentabilité exceptionnelle, projet mené de main de maître. Votre gestion financière et stratégique est un cas d'école. Bravo !";
    } else if (finalMargin >= 5) {
        category = "Directeur de Projet chevronné";
        description = "Vous avez su préserver la rentabilité face à l'adversité. Une performance solide qui démontre une grande expérience.";
    } else if (finalMargin > 0) {
        category = "Gestionnaire Prudent";
        description = "Le projet est rentable, c'est l'essentiel. Des optimisations sont possibles, mais vous avez évité la catastrophe. Mission accomplie.";
    } else {
        category = "Projet en Difficulté";
        description = "La rentabilité n'est pas au rendez-vous. Cette simulation difficile est riche d'enseignements pour affiner votre gestion des risques.";
    }
    DOMElements.resultCategory.textContent = category;
    DOMElements.resultDescription.textContent = description;

    let breakdownHTML = `<h4 class="text-lg font-bold text-center text-blue-300 mb-4">Bilan Financier & Opérationnel</h4>`;
    for (const key in state.metrics) {
        const metric = state.metrics[key];
        const value = metric.isCurrency ? formatCurrency(metric.value) : metric.isPercentage ? `${metric.value.toFixed(2)}%` : `${metric.value}/100`;
        let colorClass = 'text-white';
        if(key === 'marge') colorClass = metric.value > 10 ? 'text-green-400' : metric.value > 0 ? 'text-amber-400' : 'text-red-400';

        breakdownHTML += `
            <div class="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
                <span class="font-semibold text-slate-300">${metric.icon} ${CONFIG.initialMetrics[key].name}</span>
                <span class="font-bold text-lg ${colorClass}">${value}</span>
            </div>
        `;
    }
    DOMElements.scoreBreakdown.innerHTML = breakdownHTML;
}

// --- Rendering Functions ---
function renderAll() {
    renderMetrics();
    renderPowerUps();
}

function renderChoices(choices) {
    DOMElements.choicesContainer.innerHTML = choices.map((choice, index) => {
        let financialPreview = '';
        if (state.auditActive) {
            const costImpact = choice.impacts.couts || 0;
            const caImpact = choice.impacts.chiffreAffaires || 0;
            financialPreview = `
                <div class="text-xs mt-2">
                    <span class="text-red-400">Coût: ${formatCurrency(costImpact)}</span> | 
                    <span class="text-green-400">C.A.: ${formatCurrency(caImpact)}</span>
                </div>
            `;
        }
        return `
            <div id="choice-${index}" onclick="handleChoice(${index})" class="group bg-slate-700/50 hover:bg-slate-700 border-2 border-transparent hover:border-blue-500 rounded-xl p-5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-blue-500/20">
                <p class="text-slate-100 font-semibold text-lg">${choice.text}</p>
                ${financialPreview}
            </div>
        `;
    }).join('');
}

function renderMetrics() {
    DOMElements.metricsContainer.innerHTML = Object.keys(state.metrics).map(key => createMetricHTML(key)).join('');
}

function renderMetric(key) {
    const metricElement = document.getElementById(`metric-${key}`);
    if (metricElement) metricElement.outerHTML = createMetricHTML(key);
    else renderMetrics();
}

function createMetricHTML(key) {
    const metric = state.metrics[key];
    let valueDisplay, barDisplay = '';

    if (metric.isCurrency) {
        valueDisplay = formatCurrency(metric.value).replace(/\s/g, ' ').replace('€', ' €');
    } else if (metric.isPercentage) {
        valueDisplay = `${metric.value.toFixed(1)}%`;
        const colorClass = metric.value > 10 ? 'bg-green-500' : metric.value > 0 ? 'bg-amber-500' : 'bg-red-500';
        barDisplay = `<div class="w-full h-1.5 bg-slate-600 rounded-full mt-1"><div class="h-full ${colorClass}" style="width: ${Math.max(0, metric.value * 5 + 50)}%;"></div></div>`;
    } else {
        valueDisplay = metric.value;
        const colorClass = metric.value > 70 ? 'bg-green-500' : metric.value > 40 ? 'bg-amber-500' : 'bg-red-500';
        barDisplay = `<div class="w-full h-1.5 bg-slate-600 rounded-full mt-1"><div class="h-full ${colorClass}" style="width: ${metric.value}%;"></div></div>`;
    }

    return `
        <div id="metric-${key}" class="relative bg-slate-700/50 rounded-xl p-2 text-center transition-all duration-300">
            <div class="text-xs text-slate-400 font-medium">${metric.icon} ${CONFIG.initialMetrics[key].name}</div>
            <div class="text-lg sm:text-xl font-bold text-white">${valueDisplay}</div>
            ${barDisplay}
        </div>
    `;
}

function showMetricChangeIndicator(key, change, isCurrency = false) {
    const metricElement = document.getElementById(`metric-${key}`);
    if (!metricElement) return;
    const indicator = document.createElement('div');
    const isCost = key === 'couts';
    const colorClass = change > 0 ? (isCost ? 'text-red-400' : 'text-green-400') : (isCost ? 'text-green-400' : 'text-red-400');
    indicator.className = `metric-change absolute top-0 right-2 text-lg font-bold ${colorClass}`;
    indicator.textContent = `${change > 0 ? '+' : ''}${isCurrency ? formatCurrency(change) : change}`;
    metricElement.appendChild(indicator);
    setTimeout(() => indicator.remove(), 1500);
}

function renderPowerUps() {
    DOMElements.powerUpContainer.innerHTML = Object.keys(state.powerUps).map(key => {
        const pu = state.powerUps[key];
        const isDisabled = pu.count <= 0;
        return `
            <button onclick="usePowerUp('${key}')" title="${pu.description} (${pu.count} restants)" 
                    class="relative w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 transform hover:scale-110
                           ${isDisabled ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/30'}">
                ${pu.icon}
                ${!isDisabled ? `<span class="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">${pu.count}</span>` : ''}
            </button>
        `;
    }).join('');
}

window.onload = () => {
    DOMElements.startScreen.classList.add('opacity-100');
};

// Rendez les fonctions globales pour le HTML inline (important pour que les boutons onclick fonctionnent)
window.startGame = startGame;
window.restartGame = restartGame;
window.handleChoice = handleChoice;
window.usePowerUp = usePowerUp;