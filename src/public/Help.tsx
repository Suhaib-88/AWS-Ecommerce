import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import Chatbot from '@/components/Chatbot';
import { Interactions as InteractionsLexV1 } from '@aws-amplify/interactions/lex-v1';

const Help: React.FC = () => {
  const [checkingBackend, setCheckingBackend] = useState<boolean>(false);
  const [backendConfigured, setBackendConfigured] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [responseCards, setResponseCards] = useState<any[] | null>(null);

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    setCheckingBackend(true);
    try {
      await InteractionsLexV1.send({ botName: chatbotConfig.bot, message: 'Hey Retail Demo Store' });
      setBackendConfigured(true);
    } catch (err) {
      console.error('Error communicating with chatbot: ' + err);
      setError(err.toString());
      setBackendConfigured(false);
    } finally {
      setCheckingBackend(false);
    }
  };

  const handleChatResponse = (response: any) => {
    const botCtr = document.getElementById('chatBot');
    if (botCtr) {
      botCtr.scrollTop = botCtr.scrollHeight;
    }
    if (response.responseCard && response.responseCard.genericAttachments) {
      setResponseCards(response.responseCard.genericAttachments);
    } else {
      setResponseCards(null);
    }
  };

  const chatbotConfig = {
    bot: process.env.REACT_APP_VITE_BOT_NAME || '',
    clearComplete: false,
    botTitle: "Retail Demo Store Support",
    conversationModeOn: false,
    voiceEnabled: false,
    textEnabled: true
  };

  return (
    <Layout>
      <div className="content">
        <div className="container">
          <h3>Customer Support</h3>

          {checkingBackend && (
            <div className="container mb-4">
              <i className="fas fa-spinner fa-spin fa-3x"></i>
            </div>
          )}

          {backendConfigured && (
            <div>
              <p>Support available 24/7/365. For immediate assistance please ask a question using the form below and our virtual assistant will direct your request.</p>
              <div className="row">
                <div className="col-sm">
                  <Chatbot onChatResponse={handleChatResponse} chatbotConfig={chatbotConfig} id="chatBot" />
                </div>
                <div className="col-sm">
                  <div className="card-deck">
                    {responseCards && responseCards.map(card => (
                      <div className="card card-recommend mb-3" key={card.title}>
                        <img className="card-img-top" src={card.imageUrl} alt={card.title} />
                        <div className="card-body">
                          <h6 className="card-title">{card.title}</h6>
                          <p className="card-text"><small>{card.subTitle}</small></p>
                          <a className="btn btn-secondary btn-block mt-auto" href={card.attachmentLinkUrl}>Learn more...</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!checkingBackend && !backendConfigured && (
            <p>The virtual assistant does not appear to be configured for this deployment.</p>
          )}

          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </Layout>
  );
};

export default Help;
