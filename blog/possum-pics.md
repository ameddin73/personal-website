# Building a Random Image Texting Service: A Step-by-Step Guide

Hey there, fellow coders! Ever wanted to surprise your friends with a random image every hour? Or maybe you have a spouse who loves a specific animal and you want to make their day by sending them pictures of their favorite critter regularly? Well, you're in the right place! In this tutorial, we're going to build a random image texting service called **Possum Pics**. But don't worry, you can easily adapt this example to send any type of image you want.

## Overview

Our random image texting service "Possum Pics" will work as follows:

1. It will use the Twitter API to fetch a random image from the "Possum every hour" Twitter account.
2. It will then send this image to subscribers using the Twilio API.
3. This process will be automated using AWS Lambda, executing every hour.

You can find the complete source code for "Possum Pics" on its [GitHub repository](https://github.com/ameddin73/possum-pics), and you can learn more about this project and others like it on [my website](https://alex-meddin.com/projects#possum). While we're using possum images as an example,
the concepts covered in this article can be applied to create a similar service for any topic or image source.

## Step 1: Setting Up Your Twitter Developer Account

First, you'll need to create a Twitter Developer account and generate API keys. Follow these steps:

1. Go to [developer.twitter.com](https://developer.twitter.com/) and sign in with your Twitter account.
2. Apply for a developer account and wait for your approval. Don't worry, we can use the free Basic plan for this.
3. Once approved, create a new App and generate the API keys (Consumer Key, Consumer Secret, and Bearer Token).

## Step 2: Setting Up Your Twilio Account

Next, set up a Twilio account and generate API keys:

1. Go to [twilio.com](https://www.twilio.com/) and sign up.
2. Verify your phone number.
3. Go to the [Twilio Console](https://www.twilio.com/console) and create a new Account.
5. Follow the prompts to get a free US phone number and generate an Auth Token.

## Step 3: Setting Up Your AWS Account

Now, set up an AWS account if you don't have one already:

1. Go to [aws.amazon.com](https://aws.amazon.com/) and sign up for a new account.
2. Sign in to the AWS Management Console and navigate to the Lambda service.
3. Create a new Lambda function. Add a name and keep the rest unchanged.

## Step 4: Writing the Code

Let's start coding our random image texting service. First, create a new project directory and initialize it with `npm init`. Install the required dependencies:

```
npm install twitter twilio
```

Next, create the following files in your project directory:

1. `index.js`: The main entry point of our Lambda function.
2. `services/tweet.js`: A module to interact with the Twitter API.
3. `services/text.js`: A module to interact with the Twilio API.

### `services/tweet.js`

This file contains a module to interact with the Twitter API. It exports a `get` function that fetches the latest tweet from a specified account.
Here's a peek at the completed file.

```javascript
const Twitter = require('twitter');

var client = new Twitter({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    bearer_token: process.env.TWITTER_BEARER,
});

module.exports = {
    get: async function (account) {
        let tweets = await client.get('statuses/user_timeline', {
            screen_name: account,
        });

        return await client.get('statuses/show/' + tweets[0].id_str, {});
    }
}
```

#### Dissecting the Code

In this section, we'll break down the `services/tweet.js` file, explaining its functionality step by step.

First, we import the `twitter` library:

```javascript
const Twitter = require('twitter');
```

This library allows us to interact with the Twitter API.

Next, we initialize the `client` object using the Twitter API keys:

```javascript
var client = new Twitter({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    bearer_token: process.env.TWITTER_BEARER,
});
```

We created a new instance of the `Twitter` class, passing in an object containing our API keys as configuration, and assigned it to `client`. These keys are retrieved from environment variables, which we'll set later in the AWS Lambda console.

Now, let's dive into the main part of the code – the `get` function:

```javascript
module.exports = {
    get: async function (account) {
```

We export an object containing an asynchronous function called `get`. This function accepts a single parameter, `account`, which represents the Twitter account handle we want to fetch the latest tweet from.

Inside the `get` function, we fetch the user's timeline:

```javascript
        let tweets = await client.get('statuses/user_timeline', {
            screen_name: account,
        });
```

We use the `client.get()` method to call the `statuses/user_timeline` Twitter API endpoint, passing in an object containing the `screen_name` property set to the `account` parameter. This method returns a Promise, which we `await` to get an array of tweets.

Next, we fetch the details of the latest tweet:

```javascript
        return await client.get('statuses/show/' + tweets[0].id_str, {});
    }
}
```

We again use the `client.get()` method to call the `statuses/show` Twitter API endpoint. This time, we pass in the ID of the latest tweet (i.e., `tweets[0].id_str`) as part of the endpoint URL. We also pass in an empty object as the second parameter because we don't need to provide any additional options. This method returns a Promise, which we `await` to get the full details of the latest tweet. Finally, we return this tweet object to the caller.

### `services/text.js`

This file contains a module to interact with the Twilio API. It exports a `send` function that sends a specified image to a phone number.

```javascript
const client = require('twilio')(process.env.TWILIO_ACCOUNT, process.env.TWILIO_AUTH);

module.exports = {
    send: function (body, mediaUrl, to) {
        client.messages
            .create({
                body: body,
                mediaUrl: mediaUrl,
                from: '+12543646442', // Replace with your Twilio phone number
                to: to,
            })
            .then(message => console.log(message.sid))
            .done();
    }
}
```

#### Dissecting the Code

In this section, we'll break down the `services/text.js` file, explaining its functionality step by step.

First, we import the `twilio` library:

```javascript
const client = require('twilio')(process.env.TWILIO_ACCOUNT, process.env.TWILIO_AUTH);
```

This library allows us to interact with the Twilio API. We create a new instance of the `twilio` client by invoking the library as a function and passing in our Twilio account credentials. These credentials are retrieved from environment variables, which we'll set later in the AWS Lambda console.

Now, let's dive into the main part of the code – the `send` function:

```javascript
module.exports = {
    send: function (body, mediaUrl, to) {
```

We export an object containing a function called `send`. This function accepts three parameters:

1. `body`: The message to send along with the image.
2. `mediaUrl`: The URL of the image to send.
3. `to`: The phone number to send the message to.

Inside the `send` function, we create and send a message using the Twilio API:

```javascript
        client.messages
            .create({
                body: body,
                mediaUrl: mediaUrl,
                from: '+12345678901', // Replace with your Twilio phone number
                to: to,
            })
```

We use the `client.messages.create()` method to create and send a message. We pass in an object containing the necessary properties:

1. `body`: The message text.
2. `mediaUrl`: The URL of the image.
3. `from`: The Twilio phone number to send the message from. Replace the example number with your own Twilio phone number.
4. `to`: The recipient's phone number.

This method returns a Promise, which we handle using `.then()` and `.done()` callbacks:

```javascript
            .then(message => console.log(message.sid))
            .done();
    }
}
```

In the `.then()` callback, we log the message SID (a unique identifier for the message) to the console. The `.done()` callback is used to signal that the Promise chain has completed.

### `index.js`

This file is the main entry point of our Lambda function. It will fetch a random image from a specified Twitter account and send it to subscribers using the Twilio API.

We'll also add in some secret functionality to add a little extra spice to the texting service.

```javascript
const tweet = require('./services/tweet');
const text = require('./services/text');

const account = ['PossumEveryHour','RaccoonEveryHr','RedPandaEveryHr'];
const message = ['Here\'s your possum of the hour :)', 'Oh no something\'s gone horribly wrong this hour. It\'s a raccoon!','Oh no something\'s gone horribly wrong this hour. It\'s a red panda!'];
const numbers = process.env.TWILIO_NUMBERS.split(',');

exports.handler = (event, context, callback) => {

    // Get possum vs raccoon account and message
    let i = Math.floor(Math.random() * 100) > 0 ? 0 : 1;
    i = i === 0 ? 0 : Math.floor(Math.random() * 2) + 1;

    // Get tweet
    tweet.get(account[i]).then((tweet) => {

        // Get image url
        let mediaUrl = tweet['extended_entities']['media'][0]['media_url'];

        console.log(mediaUrl);
        console.log(numbers);

        // Send to each number
        numbers.forEach(number => text.send(message[i], mediaUrl, number));
    }).catch((err) => {
        throw err;
    });
    callback(null, 'Finished');
};
```

#### Dissecting the Code

In this section, we'll dive deeper into the `index.js` file, breaking it down piece by piece to explain its functionality.

```javascript
const tweet = require('./services/tweet');
const text = require('./services/text');
```

At the beginning of the file, we import the `tweet` and `text` modules, which handle interactions with the Twitter and Twilio APIs, respectively.

```javascript
const account = ['PossumEveryHour','RaccoonEveryHr','RedPandaEveryHr'];
const message = ['Here\'s your possum of the hour :)', 'Oh no something\'s gone horribly wrong this hour. It\'s a raccoon!','Oh no something\'s gone horribly wrong this hour. It\'s a red panda!'];
const numbers = process.env.TWILIO_NUMBERS.split(',');
```

Next, we declare three constants. Here's where the spice comes in. We'll add a couple extra twitter accounts with different animals and fake "error messages" to send when the wrong animal gets messaged:

1. `account`: An array of Twitter account handles. In this example, we have three accounts for possums, raccoons, and red pandas.
2. `message`: An array of messages that correspond to the image being sent. Each index in this array corresponds to the same index in the `account` array.
3. `numbers`: An array of phone numbers to send the image to. We retrieve this information from an environment variable `TWILIO_NUMBERS`, which should be a comma-separated string of phone numbers.

Now, let's dive into the main part of the code – the Lambda function handler:

```javascript
exports.handler = (event, context, callback) => {
```

We export a function called `handler`, which acts as the entry point of our Lambda function. This function is triggered by an event (e.g., a cron job from Amazon EventBridge).

```javascript
    let i = Math.floor(Math.random() * 100) > 0 ? 0 : 1;
    i = i === 0 ? 0 : Math.floor(Math.random() * 2) + 1;
```

Here, we generate a random index `i` to decide which Twitter account and message to use. In this example, we have a 99% chance of picking the possum account and a 1% chance of picking one of the other two accounts (raccoon or red panda).

```javascript
    tweet.get(account[i]).then((tweet) => {
```

We use the `tweet.get()` function from the `tweet` module to fetch the latest tweet from the selected account. This function returns a Promise, which we handle using a `.then()` callback.

```javascript
        let mediaUrl = tweet['extended_entities']['media'][0]['media_url'];
```

Inside the callback, we extract the image URL from the tweet's `extended_entities` object. In this case, we're only interested in the first media item in the `media` array.

```javascript
        console.log(mediaUrl);
        console.log(numbers);
```

For debugging purposes, we log the media URL and the list of phone numbers to the console.

```javascript
        numbers.forEach(number => text.send(message[i], mediaUrl, number));
    }).catch((err) => {
        throw err;
    });
```

We loop through the `numbers` array and send the selected image to each phone number using the `text.send()` function from the `text` module. If any errors occur during this process, we catch and throw them.

```javascript
    callback(null, 'Finished');
};
```

Finally we finish by executing the callback Lambda triggered the function with.

## Step 5: Deploying Your Lambda Function

### Deploy to AWS Lambda:

1. Zip your project directory.
2. In the AWS Lambda console, upload the zip file.
3. Set the environment variables for your Lambda function:
    - `TWITTER_KEY`
    - `TWITTER_SECRET`
    - `TWITTER_BEARER`
    - `TWILIO_ACCOUNT`
    - `TWILIO_AUTH`
    - `TWILIO_NUMBERS`
4. Set the handler to `index.handler`.

### Trigger the Lambda Function

Now we have to configure an event source to trigger your Lambda function every hour. We're going to use AWS EventBridge for this. To set up an EventBridge trigger, follow these steps:

1. On your Lambda function console page, click "Add trigger"
1. Select "EventBridge (CloudWatch Events)" and "Create a new rule"
1. Enter the required details in the "Create rule" form:
   - Rule Name: **possum-pics**
   - Rule Description: **Texts a possum pic from Twitter every hour from 6AM to 11PM**
   - Rule type: **Schedule expression**
   - Schedule expression: **cron(0/60 12-23,0-6 * * ? \*)**
1. Click on "Add" to create the rule.

### Schedule

Let's pick apart the schedule from step 3. The cron expression `cron(0/60 12-23,0-6 * * ? *)` specifies an EventBridge trigger that will fire every hour between 12 PM - 11 PM and 12 AM - 6 AM. In other words, it will trigger every hour except between 7 AM and 11 AM UTC (times when our recipients might be sleeping).
The cron expression is broken down as follows:

- `0/60`: This means the trigger will fire when the minutes field is 0 (i.e., at the beginning of each hour).
- `12-23,0-6`: This specifies the hours when the trigger will fire. It includes the hours from 12 PM to 11 PM (12-23) and from 12 AM to 6 AM (0-6).
- `*`: This is a wildcard, meaning the trigger will fire every day of the month.
- `*`: Another wildcard, meaning the trigger will fire every month.
- `?`: This is a placeholder for the day of the week, indicating that the trigger will fire regardless of the day of the week.

So, the EventBridge trigger with this cron expression will fire every hour, except between 7 AM and 11 AM. You can configure any schedule you want, but be mindful that Twilio charges per text. More on that in the [Costs](#Costs) section below.

By setting up the EventBridge trigger, you've successfully automated the process of sending possum pictures every hour. You can now enjoy the adorable images without any manual intervention.

## Costs

When using cloud services, it's essential to consider the associated costs. In our example, we've used Twilio and AWS Lambda as our primary services. Here's a breakdown of their costs:

1. **Twilio**: The cost of using Twilio depends on the number of phone numbers and messages you plan to send. Texting according to the schedule we used, Twilio charges around $10 per month for each phone number. Make sure to check the [Twilio Pricing page](https://www.twilio.com/sms/pricing) for detailed information on messaging rates.

2. **AWS Lambda**: AWS Lambda offers a generous free tier, which includes 1 million free requests per month and 400,000 GB-seconds of compute time per month. Beyond the free tier, Lambda's cost depends on the number of requests and the duration of your function executions. For our purposes, it's free. [AWS Lambda Pricing page](https://aws.amazon.com/lambda/pricing/).

Keep in mind that these costs are estimates and can vary based on factors such as the region you're operating in, additional services you might use, and the volume of messages you send. It's essential to monitor your usage and adjust your implementation accordingly to manage costs effectively.

## Wrapping Up

Congratulations! You've successfully built and deployed a random image texting service using Twitter, Twilio, and AWS Lambda. This example was built around sending possum pictures, but you can easily modify the code to send any type of image you want. The possibilities are endless, so go ahead and have fun with your new service!

Find the complete source code for "Possum Pics" on its [GitHub repository](https://github.com/ameddin73/possum-pics), and learn more about this project and others like it on [my website](https://alex-meddin.com/projects#possum). 
