// ecommerce-ui/src/public/Main.tsx

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import RecommendedProductsSection from '@/components/RecommendedProductsSection/RecommendedProductsSection';
import DemoGuideBadge from '@/components/DemoGuideBadge/DemoGuideBadge';
import Product from '@/components/Product/Product';
import LoadingFallback from '@/components/LoadingFallback/LoadingFallback';
import { ProductsRepository, RecommendationsRepository } from '@/repositories/RepositoryFactory';
import { getDemoGuideArticleFromPersonalizeARN } from '@/partials/AppModal/DemoGuide/config';
import { useSelector, useDispatch } from 'react-redux';
import { openModal, markDemoWalkthroughAsShown } from '@/store/actions';
import { Modals } from '@/partials/AppModal/config';
import { RootState } from '@/store/types';

const MAX_RECOMMENDATIONS = 12;
const EXPERIMENT_USER_RECS_FEATURE = 'home_product_recs';
const EXPERIMENT_USER_RECS_COLD_FEATURE = 'home_product_recs_cold';
const EXPERIMENT_RERANK_FEATURE = 'home_featured_rerank';

const Main: React.FC = () => {
  const [featureUserRecs, setFeatureUserRecs] = useState(EXPERIMENT_USER_RECS_FEATURE);
  const [featureRerank, setFeatureRerank] = useState(EXPERIMENT_RERANK_FEATURE);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [featuredProductsDemoGuideBadgeArticle, setFeaturedProductsDemoGuideBadgeArticle] = useState<string | null>(null);
  const [featuredProductsExperiment, setFeaturedProductsExperiment] = useState<string | null>(null);
  const [userRecommendationsDemoGuideBadgeArticle, setUserRecommendationsDemoGuideBadgeArticle] = useState<string | null>(null);
  const [userRecommendations, setUserRecommendations] = useState<any[]>([]);
  const [recommendationsExperiment, setRecommendationsExperiment] = useState<string | null>(null);
  const [userRecommendationsTitle, setUserRecommendationsTitle] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.user);
  const demoWalkthroughShown = useSelector((state: RootState) => state.demoWalkthroughShown.shown);
  const personalizeUserID = useSelector((state: RootState) => state.personalizeUserID);
  const personalizeRecommendationsForVisitor = useSelector((state: RootState) => state.personalizeRecommendationsForVisitor);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!demoWalkthroughShown) {
      dispatch(openModal(Modals.DemoWalkthrough));
      dispatch(markDemoWalkthroughAsShown());
    }
  }, [demoWalkthroughShown, dispatch]);

  const fetchData = async () => {
    await getFeaturedProducts();
    await getUserRecommendations();
  };

  const getFeaturedProducts = async () => {
    setFeaturedProductsDemoGuideBadgeArticle(null);
    setFeaturedProductsExperiment(null);
    setFeaturedProducts([]);

    const featuredProducts = await ProductsRepository.getFeatured();

    if (personalizeUserID && featuredProducts.length > 0) {
      const { body, headers } = await RecommendationsRepository.getRerankedItems(
        personalizeUserID,
        featuredProducts,
        EXPERIMENT_RERANK_FEATURE,
      );
      const rerankedProducts = await body.json();
      const personalizeRecipe = headers['x-personalize-recipe'];
      const experimentName = headers['x-experiment-name'];

      if (personalizeRecipe)
        setFeaturedProductsDemoGuideBadgeArticle(getDemoGuideArticleFromPersonalizeARN(personalizeRecipe));

      if (experimentName)
        setFeaturedProductsExperiment(`Active experiment: ${experimentName}`);

      setFeaturedProducts(rerankedProducts.slice(0, MAX_RECOMMENDATIONS).map((product: any) => ({ product })));
    } else {
      setFeaturedProducts(featuredProducts.slice(0, MAX_RECOMMENDATIONS).map((product: any) => ({ product })));
    }
  };

  const getUserRecommendations = async () => {
    setIsLoadingRecommendations(true);
    setUserRecommendationsTitle(null);
    setUserRecommendations([]);
    setRecommendationsExperiment(null);
    setUserRecommendationsDemoGuideBadgeArticle(null);

    let response;
    if (personalizeRecommendationsForVisitor) {
      setFeatureUserRecs(EXPERIMENT_USER_RECS_FEATURE);

      response = await RecommendationsRepository.getRecommendationsForUser(
        personalizeUserID,
        '',
        MAX_RECOMMENDATIONS,
        featureUserRecs
      );
    } else {
      setFeatureUserRecs(EXPERIMENT_USER_RECS_COLD_FEATURE);

      response = await RecommendationsRepository.getPopularProducts(
        personalizeUserID,
        '',
        MAX_RECOMMENDATIONS,
        featureUserRecs
      );
    }
    const { body: data, headers } = response;
    if (headers) {
      const experimentName = headers['x-experiment-name'];
      const personalizeRecipe = headers['x-personalize-recipe'];

      if (experimentName || personalizeRecipe) {
        if (experimentName) setRecommendationsExperiment(`Active experiment: ${experimentName}`);

        if (personalizeRecipe) {
          setUserRecommendationsTitle(personalizeRecommendationsForVisitor
            ? 'Inspired by your shopping trends'
            : 'Popular products');

          setUserRecommendationsDemoGuideBadgeArticle(getDemoGuideArticleFromPersonalizeARN(personalizeRecipe));
        } else if (experimentName) {
          setUserRecommendationsTitle('Recommended for you');
        }

        const userRecommendationsData = await data.json();
        setUserRecommendations(userRecommendationsData);

        if (userRecommendationsData.length > 0 && 'experiment' in userRecommendationsData[0]) {
          // Assuming AnalyticsHandler is a function or hook
          AnalyticsHandler.identifyExperiment(user, userRecommendationsData[0].experiment);
        }
      }
    }

    setIsLoadingRecommendations(false);
  };

  return (
    <Layout>
      <div className="container">
        <section className="mb-5">
          {userRecommendationsTitle && (
            <div className="mb-3 text-left">
              <h2 className="recommendations-heading">
                {userRecommendationsTitle}
                {userRecommendationsDemoGuideBadgeArticle && (
                  <DemoGuideBadge
                    article={userRecommendationsDemoGuideBadgeArticle}
                    hideTextOnSmallScreens
                  />
                )}
              </h2>
              {recommendationsExperiment && (
                <div className="recommendation-explanation text-muted small">
                  <i className="fa fa-balance-scale px-1"></i>
                  {recommendationsExperiment}
                </div>
              )}
            </div>
          )}

          {personalizeUserID && (
            (isLoadingRecommendations && !userRecommendations.length) || (!isLoadingRecommendations && userRecommendations.length) ? (
              <LoadingFallback className="col my-4 text-center" />
            ) : (
              <div className="user-recommendations">
                {userRecommendations.map((item: any) => (
                  <Product
                    key={item.product.id}
                    product={item.product}
                    experiment={item.experiment}
                    promotionName={item.promotionName}
                    feature={featureUserRecs}
                  />
                ))}
              </div>
            )
          )}

          {!isLoadingRecommendations && !userRecommendationsTitle && (
            <div className="text-left">
              <em>
                Personalized recommendations do not appear to be enabled for this instance of the storefront yet. Please complete the Personalization workshop labs to add personalized capabilities.
                In the meantime, the default user experience will provide product information directly from the catalog.
              </em>
            </div>
          )}
        </section>

        <RecommendedProductsSection
          feature={featureRerank}
          recommendedProducts={featuredProducts}
          experiment={featuredProductsExperiment}
        >
          <div slot="heading">
            Featured products
            {featuredProductsDemoGuideBadgeArticle && (
              <DemoGuideBadge
                article={featuredProductsDemoGuideBadgeArticle}
                hideTextOnSmallScreens
              />
            )}
          </div>
        </RecommendedProductsSection>
      </div>
    </Layout>
  );
};

export default Main;
