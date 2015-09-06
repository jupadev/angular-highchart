angular.module('demoApp.mockup', ['ui.bootstrap', 'dndLists'])
  .controller('MockupController', function($scope, storageService, AUTH,
    EmployeeService, ngTableParams, $filter) {
    var BACKGROUND_COLOR_CHART = '#8A97A9',
    countChartCreated = 0;
    $scope.charts = getMockData();
    $scope.chartsList = getMockData();
    $scope.renderedCharts = [];
    $scope.title = "Your dashboard title";
    $scope.editMode = false;
    $scope.showChartMenu = false;
    $scope.toggleEditMode = function(){
      $scope.editMode = !$scope.editMode;
    };

    $scope.toggleChartMenu = function(){
      $scope.showChartMenu = !$scope.showChartMenu;
    };

    $scope.dragoverCallback = function(event, index, external, type) {
        return index > 0;
    };

    $scope.dropCallback = function(event, index, item, external, type, allowedType) {
      addNewChart(item);
      return item;
    };

    $scope.chartQuery='';
    $scope.searchChart = function () {
      if($scope.chartQuery.lenght === 0) {
        $scope.chartsList = _.clone($scope.charts);
      } else {
        $scope.chartsList = _.filter($scope.charts, function(item) {
          if(item.name.indexOf($scope.chartQuery)> -1) {
            return item;
          }
        });
      }
    };

    function addNewChart(item) {
      countChartCreated ++;
      var config = item.config,
      chartName = countChartCreated;
      chartName = 'chart' +chartName;
      config.chart.renderTo = chartName;
      var chartContainer = $('#chartContainer').prepend(createChartContainer(item, chartName)),
      chart = new Highcharts.Chart(config);
      $scope.renderedCharts.push(item);
    }

    function createChartContainer(item, chartName) {
      return '<div class="col-xs-3 col-xs-offset-9 col-sm-2 col-sm-offset-10 text-right margin-top-20"><a href="#">Close</a></div>' + 
      '<div id="' + chartName +'"></div>';
    }

    function getMockData() {
      return  [
                {
                  name: 'Monthly cost',
                  type: 'bar',
                  config: {
                    chart: {
                        type: 'column',
                        renderTo: '',
                        backgroundColor: BACKGROUND_COLOR_CHART
                    },
                    title: {
                        text: 'Monthly cost'
                    },
                    xAxis: {
                        categories: [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May',
                            'Jun',
                            'Jul',
                            'Aug',
                            'Sep',
                            'Oct',
                            'Nov',
                            'Dec'
                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'USD'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} Milion</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: 'Tokyo',
                        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

                    }, {
                        name: 'New York',
                        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

                    }, {
                        name: 'London',
                        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

                    }, {
                        name: 'Berlin',
                        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

                    }]
                }
                },
                {
                  name: 'Payments to suppliers',
                  type: 'line',
                  config: {
                    chart: {
                        type: 'line',
                        renderTo: '',
                        backgroundColor: BACKGROUND_COLOR_CHART
                    },
                    title: {
                        text: 'Monthly Average payments to suppliers'
                    },
                    xAxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    },
                    yAxis: {
                        title: {
                            text: 'Millions'
                        }
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: [{
                        name: 'Tokyo',
                        data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    }, {
                        name: 'London',
                        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                    }, {
                        name: 'New York',
                        data: [7.0, 6.9, 9.5, 12.5, 12.4, 21.5, 21.2, 22.5, 23.3, 18.3, 13.9, 8.6]
                    }, {
                        name: 'Berlin',
                        data: [12.0, 5.9, 3.5, 19.5, 18.4, 21.5, 35.2, 6.5, 2.3, 8.3, 18.9, 11.6]
                    }]
                }
                },
                {
                  name: 'Yearly cost  by offices',
                  type: 'pie',
                  config: {
                      chart: {
                        renderTo: '',
                        backgroundColor: BACKGROUND_COLOR_CHART
                      },
                      title: {
                        text: 'Yearly cost  by offices'
                      },
                      tooltip: {
                        headerFormat: '',
                        pointFormat: "<b>{point.name}:</b> {point.percentage:.2f} %"
                      },
                      plotOptions: {
                        pie: {
                          allowPointSelect: true,
                          cursor: 'pointer',
                          dataLabels: {
                            enabled: true,
                            formatter: function() {
                              return '<b>' + this.point.name + '</b>: ' + this.y;
                            },
                            color:'#404040',
                            style: {
                                    textShadow: false 
                                }
                          }
                        }
                      },
                      series: [{
                        type: 'pie',
                        name: 'Office incomes',
                        data: [["Edinburgh",342000],["Tokyo",327900],["Singapore",138575],["London",114500],["New York",98540]]
                      }]
                    }
                }
                ];
      
    }
  });