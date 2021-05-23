# Sendgrid-connector
## Google Data Studio Sendgrid Connector for Category Statistics

This connector allows you to visualize your email performance by category.  It's important to keep in mind that Category statistics are available for the previous thirteen months only. So, you can compare your email category statistics and see how it is performing. 

![alt text](https://i.imgur.com/ADm5W20.png)
In Sendgrid you can fetch the data only for 5 categories at a time. Using this connector you can fetch the data for all your categories at a time, but you cannot set up a date range. It works only if you choose the exact day.

#### These are basic metrics available in Sendgrid Stat:
- Blocks - The number of emails that were not allowed to be delivered by ISPs.
- Bounces - The number of emails that bounced instead of being delivered.
- Clicks - The number of links that were clicked in your emails.
- Delivered - The number of emails SendGrid was able to confirm were delivered to a recipient.
- Invalid Emails - The number of recipients that you sent emails to, who had malformed email addresses, or whose mail provider reported the address as invalid.
- Opens - The total number of times your emails were opened by recipients.
- Requests - The number of emails you requested to send via SendGrid.
- Spam Reports - The number of recipients who marked your email as spam.
- Unique Opens - The number of unique recipients who opened your emails.
- Unique Clicks - The number of unique recipients who clicked links in your emails.
- Unsubscribes - The number of recipients who unsubscribed from your emails.
- Unsubscribe Drops - The number of emails dropped by SendGrid because the recipient unsubscribed from your emails.

#### Also, I created some of the calculated fields to gather more information about customer engagement with our email campaigns, and to better understand their interaction and behavior :
```sh
Open Rate, % 
      .setFormula('$unique_opens / $delivered * 100')
  
Click-Through Rate, %
      .setFormula('$clicks / $delivered * 100')
  
Click-Through Open Rate, %
      .setFormula('$unique_clicks / $unique_opens * 100')

Bounce Rate,%
      .setFormula('$bounces / $requests * 100')
```



#### If you want to reuse this connector set up this function to follow up on the error reports
```sh
function isAdminUser() {
  return true;
}
```
