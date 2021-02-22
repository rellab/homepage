
      function drawWinChart(field, title, label) {
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', '%');
        data.addRows([
          ['勝ち', field.winAgent1/field.total() * 100],
          ['負け', field.winAgent2/field.total() * 100],
          ['引き分け', field.evenAgents/field.total() * 100]
        ]);

        // Set chart options
        var options = {'title':title,
               'vAxis':{'minValue':0,'maxValue':100},
                       'width':400,
                       'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById(label));
        chart.draw(data, options);        
      }

      function drawGCPChart(a, title, label) {
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', '%');
        data.addRows([
          ['グー', a[KEN.GU]/(a[KEN.GU]+a[KEN.CHOKI]+a[KEN.PA]) * 100],
          ['チョキ', a[KEN.CHOKI]/(a[KEN.GU]+a[KEN.CHOKI]+a[KEN.PA]) * 100],
          ['パー', a[KEN.PA]/(a[KEN.GU]+a[KEN.CHOKI]+a[KEN.PA]) * 100]
        ]);

        // Set chart options
        var options = {'title':title,
               'vAxis':{'minValue':0,'maxValue':100},
                       'width':400,
                       'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById(label));
        chart.draw(data, options);        
      }
