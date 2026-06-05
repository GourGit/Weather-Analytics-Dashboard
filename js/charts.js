let chart;
let tempBarChart;
let weatherPieChart;
let humidityWindChart;

/* Main Temperature Line Chart */
function createTemperatureChart(data) {
    const labels = [];
    const temps = [];

    data.list.slice(0, 8).forEach(d => {
        labels.push(d.dt_txt.split(" ")[1].slice(0, 5));
        temps.push(Math.round(d.main.temp));
    });

    const canvas = document.getElementById("tempChart");
    const ctx = canvas.getContext("2d");

    if (chart) chart.destroy();

    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, "rgba(56, 189, 248, 0.35)");
    gradient.addColorStop(0.5, "rgba(37, 99, 235, 0.15)");
    gradient.addColorStop(1, "rgba(15, 23, 42, 0)");

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Temperature",
                data: temps,
                borderColor: "#38BDF8",
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.45,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: "#38BDF8",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            animation: {
                duration: 900,
                easing: "easeOutQuart"
            },

            interaction: {
                intersect: false,
                mode: "index"
            },

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    titleColor: "#ffffff",
                    bodyColor: "#cbd5e1",
                    borderColor: "rgba(56, 189, 248, 0.4)",
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return ` Temperature: ${context.raw}°C`;
                        }
                    }
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: "#94A3B8",
                        font: {
                            size: 12,
                            weight: "600"
                        }
                    },
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },

                y: {
                    ticks: {
                        color: "#94A3B8",
                        font: {
                            size: 12,
                            weight: "600"
                        },
                        callback: function (value) {
                            return value + "°C";
                        }
                    },
                    grid: {
                        color: "rgba(148, 163, 184, 0.12)"
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });

    createTemperatureBarChart(data);
    createWeatherPieChart(data);
    createHumidityWindChart(data);
}

/* Upcoming Temperature Bar Chart */
function createTemperatureBarChart(data) {
    const labels = [];
    const temps = [];

    data.list.slice(0, 8).forEach(d => {
        labels.push(d.dt_txt.split(" ")[1].slice(0, 5));
        temps.push(Math.round(d.main.temp));
    });

    const canvas = document.getElementById("tempBarChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (tempBarChart) tempBarChart.destroy();

    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, "rgba(251, 191, 36, 0.95)");
    gradient.addColorStop(0.5, "rgba(249, 115, 22, 0.75)");
    gradient.addColorStop(1, "rgba(239, 68, 68, 0.35)");

    tempBarChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Upcoming Temperature",
                data: temps,
                backgroundColor: gradient,
                borderRadius: 12,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            animation: {
                duration: 900,
                easing: "easeOutBounce"
            },

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    titleColor: "#ffffff",
                    bodyColor: "#cbd5e1",
                    borderColor: "rgba(251, 191, 36, 0.5)",
                    borderWidth: 1,
                    cornerRadius: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return ` Temperature: ${context.raw}°C`;
                        }
                    }
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: "#94A3B8",
                        font: {
                            size: 11,
                            weight: "600"
                        }
                    },
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },

                y: {
                    ticks: {
                        color: "#94A3B8",
                        callback: function (value) {
                            return value + "°C";
                        }
                    },
                    grid: {
                        color: "rgba(148, 163, 184, 0.12)"
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });
}

/* Weather Condition Doughnut Chart */
function createWeatherPieChart(data) {
    const conditionCount = {};

    data.list.slice(0, 16).forEach(d => {
        const condition = d.weather[0].main;

        if (conditionCount[condition]) {
            conditionCount[condition]++;
        } else {
            conditionCount[condition] = 1;
        }
    });

    const labels = Object.keys(conditionCount);
    const values = Object.values(conditionCount);

    const canvas = document.getElementById("weatherPieChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (weatherPieChart) weatherPieChart.destroy();

    weatherPieChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "rgba(56, 189, 248, 0.9)",
                    "rgba(250, 204, 21, 0.9)",
                    "rgba(34, 197, 94, 0.9)",
                    "rgba(168, 85, 247, 0.9)",
                    "rgba(239, 68, 68, 0.9)",
                    "rgba(148, 163, 184, 0.9)"
                ],
                borderColor: "rgba(15, 23, 42, 0.9)",
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            cutout: "62%",

            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000
            },

            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#CBD5E1",
                        boxWidth: 12,
                        padding: 14,
                        font: {
                            size: 11,
                            weight: "600"
                        }
                    }
                },

                tooltip: {
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    titleColor: "#ffffff",
                    bodyColor: "#cbd5e1",
                    borderColor: "rgba(56, 189, 248, 0.4)",
                    borderWidth: 1,
                    cornerRadius: 12,
                    callbacks: {
                        label: function (context) {
                            return ` ${context.label}: ${context.raw} times`;
                        }
                    }
                }
            }
        }
    });
}

/* Humidity and Wind Line Chart */
function createHumidityWindChart(data) {
    const labels = [];
    const humidity = [];
    const wind = [];

    data.list.slice(0, 8).forEach(d => {
        labels.push(d.dt_txt.split(" ")[1].slice(0, 5));
        humidity.push(d.main.humidity);
        wind.push(Math.round(d.wind.speed));
    });

    const canvas = document.getElementById("humidityWindChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (humidityWindChart) humidityWindChart.destroy();

    humidityWindChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Humidity %",
                    data: humidity,
                    borderColor: "#22C55E",
                    backgroundColor: "rgba(34, 197, 94, 0.12)",
                    borderWidth: 3,
                    tension: 0.45,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 6
                },
                {
                    label: "Wind km/h",
                    data: wind,
                    borderColor: "#A855F7",
                    backgroundColor: "rgba(168, 85, 247, 0.12)",
                    borderWidth: 3,
                    tension: 0.45,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            animation: {
                duration: 900,
                easing: "easeOutQuart"
            },

            interaction: {
                intersect: false,
                mode: "index"
            },

            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#CBD5E1",
                        boxWidth: 12,
                        padding: 14,
                        font: {
                            size: 11,
                            weight: "600"
                        }
                    }
                },

                tooltip: {
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    titleColor: "#ffffff",
                    bodyColor: "#cbd5e1",
                    borderColor: "rgba(56, 189, 248, 0.4)",
                    borderWidth: 1,
                    cornerRadius: 12
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: "#94A3B8",
                        font: {
                            size: 11,
                            weight: "600"
                        }
                    },
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },

                y: {
                    ticks: {
                        color: "#94A3B8"
                    },
                    grid: {
                        color: "rgba(148, 163, 184, 0.12)"
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });
}