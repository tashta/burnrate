Template.graph.rendered = function(){
  var self = this;
  this.autorun(function(){
    // This is only set if it is a first logon - only acceptable for hackathon
    if (Session.get('loadingTxs')) {
      // TODO: Display loading bar/icon
      return;
    }
    var activeAccount = Session.get('activeAccount');
    var mockTransactions = Session.get('mockTxs');

    function showTransactions(d){
      //d.x because x is the date object
      Session.set('transactionDate', d.x);
    }
   
    var data;

    if(self.data.graph_id == "past_graph"){
      data = getDayRange(null, new Date());
    }else{
      var date = Session.get('graphDate');
      var startDate = moment();
      var endDate = moment().add(1, 'month');

      if (date) {
        startDate.add(date, 'month');
        endDate.add(date, 'month');
        $('.graph-header.future').text(date + ' Months from Now');
      } else {
        $('.graph-header.future').text('Next Month');
      }

      startDate = new Date(startDate);
      endDate = new Date(endDate);

      data = mockTransactions ?
        // Ask a what-if?
        mockDayRange(mockTransactions, startDate, endDate) :
        getDayRange(startDate, endDate);
    }

    data = getGraphTransform(data);
    var graph_config = {
      bindto: "#"+self.data.graph_id,
      data: {
        onclick: showTransactions,
        x: 'date',
        xFormat: '%m%d%Y',
        columns: data[activeAccount],
        types:{
          'credit':'area',
          'debit':'area',
          'balance': 'line'
        },
        colors:{
          'credit':'#00FF00',
          'debit':'#FF0000',
          'balance': '#0000FF'
        }
      },
      axis:{
        x:{
          type:"timeseries"
        }
      },
    };
    var chart = c3.generate(graph_config);
  });
};
