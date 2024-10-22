import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Product from '@/components/Product/Product';
import Layout from '@/components/Layout/Layout';
import DemoGuideBadge from '@/components/DemoGuideBadge/DemoGuideBadge';
import { getDemoGuideArticleFromPersonalizeARN } from '@/partials/AppModal/DemoGuide/config';
import { capitalize } from '@/util/capitalize';
import { ProductsRepository, RecommendationsRepository } from '@/repositories/RepositoryFactory';
import { AnalyticsHandler } from '@/analytics/AnalyticsHandler';

const ExperimentFeature = 'category_detail_rank';
const MaxProducts = 60;

const CategoryDetail: React.FC = () => {
  const [feature] = useState(ExperimentFeature);
  const [demoGuideBadgeArticle, setDemoGuideBadgeArticle] = useState<string | null>(null);
  const [experiment, setExperiment] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [display, setDisplay] = useState<string>('');
  const isInitiallyMobile = window.matchMedia('(max-width: 992px)').matches;
  const mediaQueryList = useRef(window.matchMedia('(max-width: 992px)'));

  const user = useSelector((state: any) => state.user);
  const categories = useSelector((state: any) => state.categories.categories);
  const personalizeUserID = useSelector((state: any) => state.personalizeUserID);

  useEffect(() => {
    fetchData();
    const listener = () => {
      const collapseElements = showGenderFilter ? [genderCollapseRef.current, styleCollapseRef.current] : [styleCollapseRef.current];
      $(collapseElements).collapse(mediaQueryList.current.matches ? 'hide' : 'show');
    };
    mediaQueryList.current.addEventListener('change', listener);
    return () => {
      mediaQueryList.current.removeEventListener('change', listener);
    };
  }, []);

  const fetchData = async () => {
    getProductsByCategory(window.location.pathname.split('/').pop() || '');
  };

  const getProductsByCategory = async (categoryName: string) => {
    setDemoGuideBadgeArticle(null);
    setExperiment(null);
    setProducts([]);

    let intermediate = null;
    if (categoryName === 'featured') {
      intermediate = await ProductsRepository.getFeatured();
    } else {
      intermediate = await ProductsRepository.getProductsByCategory(categoryName);
    }

    if (personalizeUserID && intermediate.length > 0) {
      const { body, headers } = await RecommendationsRepository.getRerankedItems(personalizeUserID, intermediate, ExperimentFeature);

      if (headers) {
        const personalizeRecipe = headers['x-personalize-recipe'];
        const experimentName = headers['x-experiment-name'];

        if (personalizeRecipe) setDemoGuideBadgeArticle(getDemoGuideArticleFromPersonalizeARN(personalizeRecipe));
        if (experimentName) setExperiment(`Active experiment: ${experimentName}`);
      }

      const data = await body.json();
      setProducts(data.slice(0, MaxProducts));

      if (data.length > 0 && 'experiment' in data[0]) {
        AnalyticsHandler.identifyExperiment(user, data[0].experiment);
      }
    } else {
      setProducts(intermediate.slice(0, MaxProducts));
    }

    setDisplay(categoryName);
  };

  const showGenderFilter = categories?.find((category: any) => category.name === window.location.pathname.split('/').pop())?.has_gender_affinity;

  const styles = Array.from(new Set(products.map(product => product.style))).sort();

  const filteredProducts = products.filter(product => {
    const styleMatch = selectedStyles.length ? selectedStyles.includes(product.style) : true;
    const genderMatch = selectedGenders.length ? selectedGenders.includes(product.gender_affinity) || !product.gender_affinity : true;
    return styleMatch && genderMatch;
  });

  return (
    <Layout isLoading={!products.length}>
      <div className="container" style={{ display: products.length ? 'block' : 'none' }}>
        <h2 className="text-left">
          {capitalize(display)}{' '}
          {demoGuideBadgeArticle && <DemoGuideBadge article={demoGuideBadgeArticle} hideTextOnSmallScreens />}
        </h2>
        {experiment && (
          <div className="text-muted text-left">
            <small>
              <em>
                <i className="fa fa-balance-scale"></i> {experiment}
              </em>
            </small>
          </div>
        )}

        <div className="mt-4 d-flex flex-column flex-lg-row">
          <div className="filters mb-4 mb-lg-4 mr-lg-4 text-left">
            <h4 className="bg-light p-2">Filters</h4>
            {showGenderFilter && (
              <div className="gender-filter-border">
                <a
                  className="filter-title mb-1 mt-1"
                  data-toggle="collapse"
                  data-target="#gender-filter"
                  aria-expanded={!isInitiallyMobile}
                  aria-controls="gender-filter"
                >
                  <i className="chevron fa fa-chevron-up ml-2"></i>
                  Gender
                </a>
                <div className={`collapse ${isInitiallyMobile ? 'hide' : 'show'}`} id="gender-filter">
                  {['M', 'F'].map(gender => (
                    <div className="p-1 pl-2" key={gender}>
                      <label className="mb-1">
                        <input
                          className="mr-1"
                          type="checkbox"
                          value={gender}
                          checked={selectedGenders.includes(gender)}
                          onChange={() => {
                            setSelectedGenders(prev =>
                              prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
                            );
                          }}
                        />
                        {{ M: 'Male', F: 'Female' }[gender]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <a
                className="filter-title mb-1 mt-1"
                data-toggle="collapse"
                data-target="#style-filter"
                aria-expanded={!isInitiallyMobile}
                aria-controls="style-filter"
              >
                <i className="chevron fa fa-chevron-up ml-2"></i>
                Styles
              </a>
              <div className={`collapse ${isInitiallyMobile ? 'hide' : 'show'}`} id="style-filter">
                {styles.map(style => (
                  <div className="p-1 pl-2" key={style}>
                    <label className="mb-0">
                      <input
                        className="mr-1"
                        type="checkbox"
                        value={style}
                        checked={selectedStyles.includes(style)}
                        onChange={() => {
                          setSelectedStyles(prev =>
                            prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
                          );
                        }}
                      />
                      {capitalize(style)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="products">
            {filteredProducts.map(product => (
              <Product key={product.id} product={product} experiment={product.experiment} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryDetail;