import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import { useDispatch } from 'react-redux';
import { Container, Col, Row, Spacer } from '@freecodecamp/ui';
import { SuperBlocks } from '@freecodecamp/shared/config/curriculum';
import { challengeTypes } from '@freecodecamp/shared/config/challenge-types';
import type {
  BlockLabel,
  BlockLayouts
} from '@freecodecamp/shared/config/blocks';
import LearnLayout from '../components/layouts/learn';
import SEO from '../components/seo';
import type { ChapterBasedSuperBlockStructure } from '../redux/prop-types';
import { SuperBlockAccordion } from '../templates/Introduction/components/super-block-accordion';
import { resetExpansion, toggleBlock } from '../templates/Introduction/redux';
import { hasFrenchIntro } from '../utils/has-french-intro';
import { getLocalCompletedChallenges } from '../utils/local-progress';

import './cours-fr.css';

type Challenge = {
  id: string;
  title: string;
  block: string;
  blockLabel?: BlockLabel;
  blockLayout: BlockLayouts;
  challengeOrder: number;
  challengeType: number;
  dashedName: string;
  order: number;
  superBlock: SuperBlocks;
  description: string | null;
  fields: { slug: string };
};

type ChallengeNode = { challenge: Challenge };

type PageData = {
  allChallengeNode: { nodes: ChallengeNode[] };
  allSuperBlockStructure: { nodes: ChapterBasedSuperBlockStructure[] };
};

type Certification = {
  key: string;
  title: string;
  subtitle: string;
  overview?: {
    cta: string;
    paragraphs: string[];
    requirementsTitle: string;
    requirements: string[];
  };
};

const UNSUPPORTED_LOCAL_SUPERBLOCKS = new Set<string>(['dev-playground']);

const UNSUPPORTED_LOCAL_BLOCKS = new Set<string>([
  'daily-coding-challenges-javascript',
  'daily-coding-challenges-python'
]);

const UNSUPPORTED_LOCAL_CHALLENGE_TYPES = new Set<number>([
  challengeTypes.backEndProject,
  challengeTypes.pythonProject,
  challengeTypes.codeAllyPractice,
  challengeTypes.codeAllyCert,
  challengeTypes.theOdinProject,
  challengeTypes.colab,
  challengeTypes.msTrophy,
  challengeTypes.dailyChallengeJs,
  challengeTypes.dailyChallengePy
]);

function isLocalChallenge(challenge: Challenge): boolean {
  return (
    !UNSUPPORTED_LOCAL_SUPERBLOCKS.has(challenge.superBlock) &&
    !UNSUPPORTED_LOCAL_BLOCKS.has(challenge.block) &&
    !UNSUPPORTED_LOCAL_CHALLENGE_TYPES.has(challenge.challengeType)
  );
}

const CERTIFICATIONS: Certification[] = [
  {
    key: 'responsive-web-design-v9',
    title: 'Responsive Web Design',
    subtitle: 'HTML & CSS pour concevoir des sites modernes et responsives.'
  },
  {
    key: 'javascript-v9',
    title: 'JavaScript',
    subtitle:
      'Programmer en JavaScript : variables, fonctions, tableaux, objets.'
  },
  {
    key: 'front-end-development-libraries-v9',
    title: 'Bibliothèques Front-End',
    subtitle:
      'React, Redux et autres outils modernes de développement front-end.',
    overview: {
      cta: "Commencer l'apprentissage",
      paragraphs: [
        'Cette certification te fait pratiquer les bibliothèques que les développeurs utilisent pour créer des interfaces web modernes : React, TypeScript, outils CSS, tests, performance, visualisation de données, et plus encore.',
        'L’objectif n’est pas seulement de lire des notions : tu vas construire des ateliers et des labs pour apprendre comment organiser une interface, gérer l’état, typer ton code et préparer des projets front-end solides.'
      ],
      requirementsTitle:
        'Pour obtenir la certification Bibliothèques Front-End :',
      requirements: [
        "termine les cinq projets obligatoires pour débloquer l'examen de certification ;",
        "réussis l'examen final Bibliothèques Front-End."
      ]
    }
  },
  {
    key: 'python-v9',
    title: 'Python',
    subtitle: 'Apprendre Python : syntaxe, structures de données, algorithmes.'
  },
  {
    key: 'relational-databases-v9',
    title: 'Bases de données relationnelles',
    subtitle: 'SQL, PostgreSQL et conception de schémas relationnels.'
  },
  {
    key: 'back-end-development-and-apis-v9',
    title: 'Back-End et APIs',
    subtitle: 'Node, Express, et construction d’APIs côté serveur.'
  },
  {
    key: 'full-stack-developer-v9',
    title: 'Cursus Full-Stack',
    subtitle: 'Le grand cursus complet : front-end + back-end + déploiement.'
  }
];

type View = { v: 'lang' } | { v: 'fr-home' } | { v: 'fr-cert'; cert: string };

function CoursFrPage({ data }: { data: PageData }): JSX.Element {
  const [view, setView] = useState<View>({ v: 'lang' });
  // localStorage n'existe pas au build (SSR) : on charge la progression apres
  // le montage pour eviter un mismatch d'hydratation.
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(
    []
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setCompletedChallengeIds(getLocalCompletedChallenges().map(c => c.id));
  }, []);

  useEffect(() => {
    if (view.v !== 'fr-cert') return;

    const superBlock = view.cert as SuperBlocks;
    const initialBlock = data.allChallengeNode.nodes.find(
      ({ challenge }) =>
        challenge.superBlock === superBlock && isLocalChallenge(challenge)
    )?.challenge.block;

    dispatch(resetExpansion());
    if (initialBlock) dispatch(toggleBlock(initialBlock));
  }, [data.allChallengeNode.nodes, dispatch, view]);

  return (
    <LearnLayout>
      <SEO title='Cours en français' />
      <Container>
        <Row>
          <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
            <Spacer size='m' />

            {view.v === 'lang' && (
              <>
                <h1 className='cours-fr-title'>Choisis ton parcours</h1>
                <p className='cours-fr-intro'>
                  Ouvre les certifications françaises, le parcours complet ou le
                  catalogue filtré.
                </p>
                <div className='cours-fr-grid'>
                  <button
                    type='button'
                    className='cours-fr-folder-card'
                    onClick={() => setView({ v: 'fr-home' })}
                  >
                    <span className='cours-fr-folder-icon'>📁</span>
                    <span className='cours-fr-folder-label'>
                      Certifications françaises
                    </span>
                    <span className='cours-fr-folder-sub'>
                      Certifications françaises disponibles.
                    </span>
                  </button>
                  <a className='cours-fr-folder-card' href='/learn'>
                    <span className='cours-fr-folder-icon'>📁</span>
                    <span className='cours-fr-folder-label'>
                      Parcours complet
                    </span>
                    <span className='cours-fr-folder-sub'>
                      Tous les cours locaux, avec les traductions quand elles
                      existent.
                    </span>
                  </a>
                  <a className='cours-fr-folder-card' href='/catalog'>
                    <span className='cours-fr-folder-icon'>📁</span>
                    <span className='cours-fr-folder-label'>Catalogue</span>
                    <span className='cours-fr-folder-sub'>
                      Catalogue global avec les filtres du site.
                    </span>
                  </a>
                </div>
              </>
            )}

            {view.v === 'fr-home' && (
              <>
                <BackBar
                  onBack={() => setView({ v: 'lang' })}
                  crumbs={['Certifications françaises']}
                />
                <h1 className='cours-fr-title'>📁 Certifications françaises</h1>
                <p className='cours-fr-intro'>
                  Choisis une certification française, ou ouvre le catalogue
                  global pour utiliser tous les filtres du site.
                </p>

                <h2 className='cours-fr-section-title'>Catalogue global</h2>
                <div className='cours-fr-grid'>
                  <a className='cours-fr-folder-card' href='/catalog'>
                    <span className='cours-fr-folder-icon'>📁</span>
                    <span className='cours-fr-folder-label'>Catalogue</span>
                    <span className='cours-fr-folder-sub'>
                      Ouvre le catalogue complet avec les filtres globaux.
                    </span>
                  </a>
                </div>

                <h2 className='cours-fr-section-title'>Par certification</h2>
                <div className='cours-fr-grid'>
                  {CERTIFICATIONS.map(cert => {
                    const hasTranslatedContent = hasFrenchIntro(cert.key);
                    return (
                      <button
                        key={cert.key}
                        type='button'
                        className='cours-fr-folder-card'
                        onClick={() =>
                          setView({ v: 'fr-cert', cert: cert.key })
                        }
                      >
                        <span className='cours-fr-folder-icon'>📁</span>
                        <span className='cours-fr-folder-label'>
                          {cert.title}
                        </span>
                        <span className='cours-fr-folder-sub'>
                          {cert.subtitle}
                        </span>
                        {!hasTranslatedContent ? (
                          <span className='cours-fr-not-translated'>
                            🚧 Traduction à venir
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {view.v === 'fr-cert' &&
              (() => {
                const cert = CERTIFICATIONS.find(c => c.key === view.cert);
                if (!cert) return <p>Certification introuvable.</p>;
                const superBlock = cert.key as SuperBlocks;
                const structure = data.allSuperBlockStructure.nodes.find(
                  node => node.superBlock === superBlock
                );
                const superBlockChallenges = data.allChallengeNode.nodes
                  .map(({ challenge }) => challenge)
                  .filter(
                    challenge =>
                      challenge.superBlock === superBlock &&
                      isLocalChallenge(challenge)
                  );
                const completedSet = new Set(completedChallengeIds);
                const totalChallenges = superBlockChallenges.length;
                const doneChallenges = superBlockChallenges.filter(challenge =>
                  completedSet.has(challenge.id)
                ).length;
                const progressPct =
                  totalChallenges > 0
                    ? Math.round((doneChallenges / totalChallenges) * 100)
                    : 0;
                return (
                  <>
                    <BackBar
                      onBack={() => setView({ v: 'fr-home' })}
                      crumbs={['Français', cert.title]}
                    />
                    <h1 className='cours-fr-title text-center'>Cours</h1>
                    <p className='cours-fr-intro cours-fr-cert-note'>
                      {cert.title} — architecture officielle freeCodeCamp. Les
                      dossiers incompatibles avec le mode local sont masqués.
                      Les autres restent disponibles selon leur état de
                      traduction.
                    </p>
                    {cert.overview && (
                      <section className='cours-fr-cert-overview'>
                        <p className='cours-fr-cert-cta'>{cert.overview.cta}</p>
                        {cert.overview.paragraphs.map(paragraph => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                        <p>
                          <strong>{cert.overview.requirementsTitle}</strong>
                        </p>
                        <ul>
                          {cert.overview.requirements.map(requirement => (
                            <li key={requirement}>{requirement}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {totalChallenges > 0 && (
                      <div
                        className='cours-fr-progress'
                        role='progressbar'
                        aria-valuenow={progressPct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Progression ${cert.title}`}
                      >
                        <div className='cours-fr-progress-head'>
                          <span className='cours-fr-progress-label'>
                            {doneChallenges}/{totalChallenges} challenges
                            terminés
                          </span>
                          <span className='cours-fr-progress-pct'>
                            {progressPct}%
                          </span>
                        </div>
                        <div className='cours-fr-progress-track'>
                          <div
                            className='cours-fr-progress-fill'
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {!structure ? (
                      <div className='cours-fr-empty'>
                        🚧 Structure de certification introuvable.
                      </div>
                    ) : (
                      <div className='cours-fr-cert-map'>
                        <SuperBlockAccordion
                          challenges={superBlockChallenges}
                          superBlock={superBlock}
                          structure={structure}
                          chosenBlock={superBlockChallenges[0]?.block ?? ''}
                          completedChallengeIds={completedChallengeIds}
                        />
                      </div>
                    )}
                  </>
                );
              })()}

            <Spacer size='l' />
          </Col>
        </Row>
      </Container>
    </LearnLayout>
  );
}

function BackBar({ onBack, crumbs }: { onBack: () => void; crumbs: string[] }) {
  return (
    <div className='cours-fr-backbar'>
      <button type='button' className='cours-fr-back-btn' onClick={onBack}>
        ← Retour
      </button>
      <span className='cours-fr-crumbs'>{crumbs.join(' / ')}</span>
    </div>
  );
}

CoursFrPage.displayName = 'CoursFrPage';
export default CoursFrPage;

export const query = graphql`
  query CoursFrQuery {
    allChallengeNode(
      sort: [
        { challenge: { superOrder: ASC } }
        { challenge: { order: ASC } }
        { challenge: { challengeOrder: ASC } }
      ]
    ) {
      nodes {
        challenge {
          id
          title
          block
          blockLabel
          blockLayout
          challengeOrder
          challengeType
          dashedName
          order
          superBlock
          description
          fields {
            slug
          }
        }
      }
    }
    allSuperBlockStructure {
      nodes {
        superBlock
        chapters {
          dashedName
          comingSoon
          modules {
            dashedName
            comingSoon
            moduleType
            blocks
          }
        }
      }
    }
  }
`;
