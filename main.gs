var cc = DataStudioApp.createCommunityConnector();

function getConfig(request) {
  var config = cc.getConfig();
  config.setDateRangeRequired(true);
  return config.build();
}

function getFields() {
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;

  fields.newDimension()
    .setId('date')
    .setType(types.YEAR_MONTH_DAY);

  fields.newDimension()
    .setId('categoryName')
    .setName('Category')
    .setType(types.TEXT);

  fields.newMetric()
    .setId('blocks')
    .setName('Blocks')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('bounce_drops')
    .setName('Bounce drops')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('bounces')
    .setName('Bounces')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('clicks')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('deferred')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('delivered')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('invalid_emails')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('opens')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('processed')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('requests')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('spam_report_drops')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('spam_reports')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('unique_clicks')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('unique_opens')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('unsubscribe_drops')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('unsubscribes')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('open_rate')
    .setName('Open Rate,%')
    .setFormula('$unique_opens / $delivered * 100')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('click-through_rate')
    .setName('CTR,%')
    .setFormula('$clicks / $delivered * 100')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('click-through_open_rate')
    .setName('CTOR,%')
    .setFormula('$unique_clicks / $unique_opens * 100')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('bounce_rate')
    .setName('Bounce Rate,%')
    .setFormula('$bounces / $requests * 100')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newMetric()
    .setId('unsubscribe_rate')
    .setName('Unsubscribe Rate,%')
    .setFormula('$unsubscribes / $delivered * 100')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);


  return fields;
}

function getSchema(request) {
  var fields = getFields().build();
  return {
    schema: fields
  };
}

function getData(request) {
  var requestedFieldIds = request.fields.map(function(field) {
    return field.name;
  });
  var requestedFields = getFields().forIds(requestedFieldIds);
  response = fetchDataFromApi(request);

  if (response.getResponseCode() == 200) {
    var parsedResponse = JSON.parse(response);
    var rows = responseToRows(requestedFields, parsedResponse);
    return {
      schema: requestedFields.build(),
      rows: rows
    };
  } else {
    DataStudioApp.createCommunityConnector()
      .newUserError()
      .setDebugText('Error fetching data from API. Exception details: ' + response)
      .setText('Error fetching data from API. Exception details: ' + response)
      .throwException();
  }
}

function responseToRows(requestedFields, response) {
  var categories = response.stats;
  var date = response.date.replace(/-/g, '');
  var obj = categories.map(function(category) {
    var row = [];
    requestedFields.asArray().forEach(function(field) {
      switch (field.getId()) {
        case 'date':
          return row.push(date);
        case 'categoryName':
          return row.push(category.name);
        case 'blocks':
          return row.push(category.metrics.blocks);
        case 'bounce_drops':
          return row.push(category.metrics.bounce_drops);
        case 'bounces':
          return row.push(category.metrics.bounces);
        case 'clicks':
          return row.push(category.metrics.clicks);
        case 'deferred':
          return row.push(category.metrics.deferred);
        case 'delivered':
          return row.push(category.metrics.delivered);
        case 'invalid_emails':
          return row.push(category.metrics.invalid_emails);
        case 'opens':
          return row.push(category.metrics.opens);
        case 'processed':
          return row.push(category.metrics.processed);
        case 'requests':
          return row.push(category.metrics.requests);
        case 'spam_report_drops':
          return row.push(category.metrics.spam_report_drops);
        case 'spam_reports':
          return row.push(category.metrics.spam_reports);
        case 'unique_clicks':
          return row.push(category.metrics.unique_clicks);
        case 'unique_opens':
          return row.push(category.metrics.unique_opens);
        case 'unsubscribe_drops':
          return row.push(category.metrics.unsubscribe_drops);
        case 'unsubscribes':
          return row.push(category.metrics.unsubscribes);
        default:
          return row.push('');
      }
    });
    return {
      values: row
    };
  });

  return obj;
}

function fetchDataFromApi(request) {
  var userProperties = PropertiesService.getUserProperties();
  var key = userProperties.getProperty('dscc.key');
  var url =
    'https://api.sendgrid.com/v3/categories/stats/sums?limit=100&start_date=' +
    request.dateRange.startDate +
    '&end_date=' +
    request.dateRange.endDate;
  var options = {
    'method': 'GET',
    'headers': {
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json'
    },
    'muteHttpExceptions': true
  };
  return UrlFetchApp.fetch(url, options);
}
