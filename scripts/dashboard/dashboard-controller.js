angular.module('demoApp.dashboard', [])
  .controller('DashboardController', function($scope, storageService, AUTH, PAGIN,
    EmployeeService, ngTableParams, $filter) {

    var token = storageService.getData(AUTH.sessionKey),
      categories = [],
      seriesData = [],
      BACKGROUND_COLOR_CHART = '#8A97A9';
    $scope.isLoading = false;
    $scope.incomePrefix = '$ ';
    $scope.data = [];
    $scope.data = null;
    getEmployees();

    function getEmployees() {
      $scope.isLoading = true;
      EmployeeService.getList(token)
        .then(function(data) {
          $scope.data = data;
          renderCharts();
        })
        .finally(function() {
          $scope.isLoading = false;
        });
    }

    function renderCharts() {
      createEmployeeList();
      createModelChartEmployees();
      createChartEmployees();
      createModelChartOffice();
      createOfficeChart();
    }

    function createEmployeeList() {
      $scope.tableParams = new ngTableParams({
        page: PAGIN.startPageIndex, 
        count: PAGIN.count, 
        sorting: {
          name: 'asc' 
        }
      }, {
        counts: [],
        total: $scope.data.length, 
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
            $filter('orderBy')($scope.data, params.orderBy()) :
            $scope.data;
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    }

    function createModelChartEmployees() {
      return _.chain($scope.data)
        .sortBy('income')
        .forEach(function(employee) {
          categories.push(employee.name);
          seriesData.push(employee.income);
        }).value();
    }

    function createChartEmployees() {
      $scope.chartConfig = {
        options: {
          chart: {
            type: 'bar',
            backgroundColor: BACKGROUND_COLOR_CHART
          }
        },
        xAxis: {
          categories: categories,
          title: {
            text: 'Employees'
          }
        },
        yAxis: {
          title: {
            text: 'Incomes'
          },
          tickInterval: 10000
        },
        series: [{
          name: 'Income',
          data: seriesData
          }],
        title: {
          text: ''
        },
        loading: false
      };
    }

    function createModelChartOffice() {
      return _.chain($scope.data)
        .groupBy('office')
        .map(function(item) {
          var newItem = [item[0].office, item[0].income];
          if (item.length > 1) {
            var incomes = aggregate(item);
            newItem[1].income = incomes;
          }
          return newItem;
        })
        .value();
    }

    function aggregate(items) {
      var sum;
      return _.reduce(items, function(sum, child) {
        return sum + child.income;
      }, sum = 0);
    }

    function createOfficeChart() {
      chart = new Highcharts.Chart({
        chart: {
          renderTo: 'incomesByOffice',
          backgroundColor: BACKGROUND_COLOR_CHART
        },
        title: {
          text: ''
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
          data: createModelChartOffice()
        }]
      });
    }

  });