/* global $,d3,chroma,_ */
$(document).ready(function () {
  const data = [
    {
      id: "k1",
      fund: "Italy",
      budgetCulture: 4.27,
      budgetTotal: 191.5,
      contentURL: "italy.html",
      position: "middle",
      acronym: "Italy"
    },
    {
      id: "k2",
      fund: "France",
      budgetCulture: 2,
      budgetTotal: 100,
      contentURL: "france.html",
      position: "middle",
      acronym: "France"
    },
    {
      id: "k3",
      fund: "Spain",
      budgetCulture: 0.52,
      budgetTotal: 69.5,
      contentURL: "spain.html",
      position: "middle",
      acronym: "Spain"
    },
    {
      id: "k4",
      fund: "Portugal",
      budgetCulture: 0.24,
      budgetTotal: 16.6,
      contentURL: "portugal.html",
      position: "middle",
      acronym: "Portugal"
    },
    {
      id: "k5",
      fund: "Poland",
      budgetCulture: 0.09,
      budgetTotal: 35.9,
      contentURL: "poland.html",
      position: "middle",
      acronym: "Poland"
    },
    {
      id: "k6",
      fund: "Greece",
      budgetCulture: 0.67,
      budgetTotal: 57.5,
      contentURL: "greece.html",
      position: "middle",
      acronym: "Greece"
    },
    {
      id: "k7",
      fund: "Belgium",
      budgetCulture: 0.06,
      budgetTotal: 5.9,
      contentURL: "belgium.html",
      position: "middle",
      acronym: "Belgium"
    },
    {
      id: "k8",
      fund: "Finland",
      budgetCulture: 0.04,
      budgetTotal: 2,
      contentURL: "finland.html",
      position: "middle",
      acronym: "Finland"
    },
    {
      id: "k9",
      fund: "Croatia",
      budgetCulture: 0.12,
      budgetTotal: 6.3,
      contentURL: "croatia.html",
      position: "middle",
      acronym: "Croatia"
    }
  ];
  const $contentStage = $(".content-stage");

  var width = $contentStage.width(),
    height = $contentStage.height() - 120,
    sizeDivisor = $contentStage.height() >= $contentStage.width() ? 5 : 3.8,
    nodePadding = 2.5;

  var svg = d3
    .select(".content-stage")
    .append("svg")
    .attr("id", "svgStage")
    .attr("viewBox", `0 0 ${width} ${height}`);

  var color = chroma
    .scale(["#43157e", "#ec1090"])
    .mode("lch")
    .colors(data.length);

  var simulation = d3
    .forceSimulation()
    .force(
      "forceX",
      d3
        .forceX()
        .strength(0.1)
        .x(width * 0.5)
    )
    .force(
      "forceY",
      d3
        .forceY()
        .strength(0.1)
        .y(height * 0.5)
    ) /*
  .force(
    "center",
    d3
      .forceCenter()
      .x(width * 0.5)
      .y(height * 0.5)
  )*/
    .force("charge", d3.forceManyBody().strength(-15));

  function parse(error, graph) {
    // console.debug(graph);
    if (error) throw error;

    // sort the nodes so that the bigger ones are at the back
    graph = graph.sort(function (a, b) {
      return b.size - a.size;
    });

    //update the simulation based on the data
    simulation
      .nodes(graph)
      .force(
        "collide",
        d3
          .forceCollide()
          .strength(0.5)
          .radius(function (d) {
            return d.radius + nodePadding;
          })
          .iterations(1)
      )
      .on("tick", function (d) {
        node.attr("transform", function (d) {
          return `translate(${d.x}, ${d.y})`;
        });
      });

    var u = svg.append("g").attr("class", "node").selectAll("g").data(graph);
    var entering = u.enter();
    var node = entering
      .append("g")
      .attr("data-purpose", "fund")
      .attr("data-id", function (d) {
        return d.id;
      });

    var circle = node
      .append("circle")
      .attr("class", "svgTooltip")
      .attr("data-id", function (d) {
        return d.id;
      })
      .attr("r", function (d) {
        return d.radius;
      })
      .attr("fill", function (d, index) {
        return color[index];
      });
    node
      .attr("transform", function (d) {
        return `translate(${d.x}, ${d.y})`;
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );
    var text = node.append("text").text(function (d) {
      return d.acronym;
    });

    text
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("fill", function (d) {
        if (d.color) {
          return d.color;
        }
        return "white";
      });

    /*
    const texts = node
      .append("text")
      .attr("data-purpose", "label")
      .text(function (d) {
        return d.fund;
      })
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle");
      */
  }

  //d3.csv("data.csv", types, parse);
  const lin2log = d3.scaleSqrt().domain([0.06, 3.2]).range([80, 900]);

  function types(d) {
    d.computedBudget = lin2log(d.budgetCulture);
    d.size = +d.computedBudget / sizeDivisor;
    d.size < 3 ? (d.radius = 3) : (d.radius = d.size);
    return d;
  }

  parse(null, data.map(types));

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0.03);
    d.fx = null;
    d.fy = null;
  }

  const renderTooltip = (d) => {
    const source = `
    <div class="CountryInfoTip">
      <table>
        <thead>
          <tr>
            <th colspan="2"><strong><%- fund %></strong></th>
          </tr>
        </thead>
        <tbody>
        <% budgets.forEach(function(budget) { %>
          <tr>
            <td data-source="label"><%- budget.label %></td>
            <td data-source="value"><%= budget.value %></td>
          </tr>
        <% }) %>
        </tbody>
      </table>
    </div>
  `;
    const render = _.template(source);
    const html = render({
      fund: d.fund,
      budgets: [
        {
          label: "Funds allocated to CCS: ",
          value: `&euro; ${d.budgetCulture} bn`
        },
        {
          label: "Total recovery budget: ",
          value: d.budgetTotal !== -1 ? `&euro; ${d.budgetTotal} bn` : "N/A"
        }
      ]
    });
    return html;
  };

  const setupTooltips = () => {
    $("#svgStage .svgTooltip").tooltipster({
      contentAsHTML: true,
      plugins: ["follower"],
      animation: "fade",
      delay: 0,
      functionInit: function (instance, helper) {
        const id = helper.origin.getAttribute("data-id");
        const item = data.find((d) => d.id === id);
        const output = renderTooltip(item);
        instance.content(output);
        // console.log("muie", id, output);
      }
    });
  };

  const setUpActions = () => {
    const $iframe = $("#sidebar-content-placeholder");
    const $sidebar = $(".sidebar");
    let lastId;
    // handle click on circles
    $('#svgStage g[data-purpose="fund"]').on("click", (event) => {
      const id = event.target.getAttribute("data-id");
      const item = data.find((d) => d.id === id);
      const isVisible = $sidebar.hasClass("sidebar-visible");
      if (id !== lastId) {
        $iframe.attr("src", item.contentURL);
      }
      if (isVisible) {
        if (id === lastId) {
          $sidebar.removeClass("sidebar-visible");
          //$("html").css("pointer-events", "inherit");
        }
      } else {
        $sidebar.addClass("sidebar-visible");
        //$("html").css("pointer-events", "none");
      }
      lastId = id;
    });
    // handle click on close button of the sidebar

    const $closeSidebarButton = $(".sidebar-close-button");
    $closeSidebarButton.on("click", (event) => {
      $sidebar.removeClass("sidebar-visible");
      event.stopPropagation();
      event.preventDefault();
      return false;
    });
  };

  const setupEvents = () => {
    const $svgStage = $("#svgStage");
    $(window).on("resize", () => {
      const newWidth = $contentStage.width();
      const newHeight = $contentStage.height();
      $svgStage.attr("width", newWidth);
      $svgStage.attr("height", Math.min(newWidth, newHeight));
    });
  };
  setupTooltips();
  setUpActions();
  setupEvents();
  $(window).trigger("resize");
});
