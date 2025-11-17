module.exports = async function (app, connection, bot, faxstore) {
    faxstore.registerExtension({
        name: 'Subscription Notifier',
        description: 'DMs the user when a subscription ends.',
        icon: 'https://syncstudio.org/images/gallery-QiT5TWJ3Xpf3SksG9SCjJzsx8zPzhCkTKihCxFFELqEde.png',
        version: '1.0.0',
        author: 'ScratchStack (SyncStudio)',
    }, __filename);

    faxstore.on('subscriptionEnded', async function (subscription, userId) {
        try {
            const productId = subscription.productId;

            connection.query(
                `SELECT * FROM storeitems WHERE id = ${productId}`,
                async function (err, item) {
                    if (err) {
                        console.error('Subscription-Notifier.js/[FaxStore Extension - SQL Error]', err);
                        return;
                    }

                    if (!item[0]) return;

                    try {
                        const user = await bot.users.fetch(userId);
                        if (!user) return;

                        const embed = {
                            title: 'Subscription Expired',
                            description:
                                `Your subscription for **${item[0].title}** has expired.`,
                            color: 0xff3b30,
                            footer: {
                                text: 'Thanks for supporting our store.',
                            },
                            timestamp: new Date(),
                        };

                        await user.send({ embeds: [embed] }).catch(() => {});
                    } catch {
                        console.log(`[Subscription-Notifier.js]: Failed to DM user ${userId}.`);
                    }
                }
            );
        } catch (e) {
            console.error('[Subscription-Notifier.js Error]:', e);
        }
    });
};
