let graficoReceita = null;

document.getElementById("formulario").addEventListener("submit", function (event) {
  event.preventDefault();

  const precoM2 = parseFloat(document.getElementById("precoM2").value);
  const quantidadeM2 = parseFloat(document.getElementById("quantidadeM2").value);
  const numUnidades = parseInt(document.getElementById("numUnidades").value, 10);
  const taxaOcupacao = parseFloat(
    document.getElementById("taxaOcupacao").value.replace('%', '')
  ) / 100;
  const estadiasCurtas = parseFloat(
    document.getElementById("estadiasCurtas").value.replace('%', '')
  ) / 100;

  if (isNaN(precoM2) || isNaN(quantidadeM2)) {
    document.getElementById("resultado").textContent =
      "Preencha todos os campos corretamente!";
    return;
  }

  // Cálculos principais
  const areaTotal = quantidadeM2 * numUnidades;
  const valorImovel = precoM2 * areaTotal;
  const precoMedioM2 = valorImovel / areaTotal;

  // Consumo (por unidade, ocupação e estadias curtas)
  const contasConsumo = 500 * numUnidades * taxaOcupacao * estadiasCurtas;

  // Novo cálculo de IPTU baseado em alíquota sobre valor venal
  // 0.00883% = 0.00883 / 100
  const aliquotaIPTU = 0.00883 / 100;
  const iptu = valorImovel * aliquotaIPTU;

  // Condomínio fixo por unidade
  const condominio = 400 * numUnidades;

  // Atualiza resultado principal
  document.getElementById("resultado").innerHTML =
    `Preço Total: <span class="valor-total">R$ ${valorImovel.toLocaleString("pt-BR", {
      minimumFractionDigits: 2
    })}</span>`;

  // Atualiza estimativas do imóvel
  document.getElementById("valorImovel").textContent =
    `R$ ${valorImovel.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  document.getElementById("precoMedioM2").textContent =
    `R$ ${precoMedioM2.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  document.getElementById("contasConsumo").textContent =
    `R$ ${contasConsumo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  document.getElementById("iptu").textContent =
    `R$ ${iptu.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  document.getElementById("condominio").textContent =
    `R$ ${condominio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  // Receita Esperada (ANUAL)
  const diaria = 1180;
  const ocupacaoDisplay = (taxaOcupacao * 100).toFixed(0) + "%";
  const receitaBruta = valorImovel * 0.05;
  const receitaLiquida = valorImovel * 0.035;

  document.getElementById("diariaHousi").textContent =
    `R$ ${diaria.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  document.getElementById("ocupacaoReceita").textContent = ocupacaoDisplay;
  document.getElementById("rentBruta").textContent =
    `R$ ${receitaBruta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  document.getElementById("rentLiquida").textContent =
    `R$ ${receitaLiquida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  // Atualiza ou cria gráfico
  if (graficoReceita) {
    graficoReceita.data.datasets[0].data = [receitaBruta, receitaLiquida];
    graficoReceita.update();
  } else {
    const ctx = document.getElementById("graficoReceita").getContext("2d");
    graficoReceita = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Bruta", "Líquida"],
        datasets: [{
          label: "Rentabilidade (R$)",
          data: [receitaBruta, receitaLiquida],
          backgroundColor: ["#557484", "#DEB5EF"]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `R$ ${ctx.raw.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `R$ ${value.toLocaleString("pt-BR")}`
            }
          }
        }
      }
    });
  }
});
