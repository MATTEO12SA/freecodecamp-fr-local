import React, { useEffect, useMemo, useState } from 'react';
import { graphql } from 'gatsby';
import type { PageProps } from 'gatsby';
import { useDispatch } from 'react-redux';
import { Container, Col, Row, Spacer } from '@freecodecamp/ui';
import { SuperBlocks } from '@freecodecamp/shared/config/curriculum';
import { challengeTypes } from '@freecodecamp/shared/config/challenge-types';
import { BlockLabel, type BlockLayouts } from '@freecodecamp/shared/config/blocks';
import LearnLayout from '../components/layouts/learn';
import { Link } from '../components/helpers';
import SEO from '../components/seo';
import type { ChapterBasedSuperBlockStructure } from '../redux/prop-types';
import { SuperBlockAccordion } from '../templates/Introduction/components/super-block-accordion';
import { resetExpansion, toggleBlock } from '../templates/Introduction/redux';
import { hasFrenchIntro } from '../utils/has-french-intro';
import { getLocalCompletedChallenges } from '../utils/local-progress';
import { groupCertificationsByFrenchAvailability } from '../utils/french-certification-groups';
import {
  getCoursFrCertificationHref,
  parseCoursFrView
} from '../utils/cours-fr-navigation';

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

function challengesInStructure(
  challenges: Challenge[],
  structure: ChapterBasedSuperBlockStructure | undefined,
  { includeExam = true }: { includeExam?: boolean } = {}
): Challenge[] {
  const blocks = new Set(
    (structure?.chapters ?? []).flatMap(chapter => {
      if (!includeExam && chapter.chapterType === 'exam') return [];
      return (chapter.modules ?? []).flatMap(module => {
        if (!includeExam && module.moduleType === BlockLabel.exam) {
          return [];
        }
        return module.blocks ?? [];
      });
    })
  );
  if (blocks.size === 0) return challenges;
  return challenges.filter(challenge => blocks.has(challenge.block));
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

function CoursFrPage({ data, location }: PageProps<PageData>): JSX.Element {
  const view = useMemo(
    () => parseCoursFrView(location.search),
    [location.search]
  );
  // localStorage n'existe pas au build (SSR) : on charge la progression apres
  // le montage pour eviter un mismatch d'hydratation.
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(
    []
  );
  const dispatch = useDispatch();
  const certificationGroups = useMemo(
    () =>
      groupCertificationsByFrenchAvailability(CERTIFICATIONS, hasFrenchIntro),
    []
  );

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
    <LearnLayout contentId='content-start'>
      <SEO title='Cours en français' />
      <Container>
        <Row>
          <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
            <Spacer size='m' />

            {view.v === 'lang' && (
              <>
                <h1 className='cours-fr-title'>Choisis ton parcours</h1>
                <p className='cours-fr-intro'>
                  Trois portes d&apos;entrée, un seul but : apprendre. Le hub
                  français liste ce qui est déjà traduit. La carte complète
                  montre tout le curriculum local. Le catalogue sert à chercher
                  et filtrer.
                </p>
                <div className='cours-fr-grid'>
                  <Link
                    className='cours-fr-folder-card cours-fr-folder-card-primary'
                    to='/cours-fr?view=certifications'
                  >
                    <span className='cours-fr-card-kind'>Recommandé</span>
                    <span className='cours-fr-folder-label'>
                      Cours disponibles en français
                    </span>
                    <span className='cours-fr-folder-sub'>
                      Certifications dont les exercices sont déjà traduits.
                    </span>
                  </Link>
                  <Link className='cours-fr-folder-card' to='/learn'>
                    <span className='cours-fr-card-kind'>Carte</span>
                    <span className='cours-fr-folder-label'>
                      Tous les parcours
                    </span>
                    <span className='cours-fr-folder-sub'>
                      La carte complète, avec le français quand il existe.
                    </span>
                  </Link>
                  <Link className='cours-fr-folder-card' to='/catalog'>
                    <span className='cours-fr-card-kind'>Recherche</span>
                    <span className='cours-fr-folder-label'>Catalogue</span>
                    <span className='cours-fr-folder-sub'>
                      Recherche, niveau, thème, et filtre Français.
                    </span>
                  </Link>
                </div>
              </>
            )}

            {view.v === 'fr-home' && (
              <>
                <BackBar
                  href='/cours-fr'
                  crumbs={['Cours disponibles en français']}
                />
                <h1 className='cours-fr-title'>
                  Cours disponibles en français
                </h1>
                <p className='cours-fr-intro'>
                  Ces certifications ont déjà des exercices en français. L&apos;examen
                  se lance depuis la page de la certification.
                </p>

                <h2 className='cours-fr-section-title'>
                  Disponibles maintenant
                </h2>
                <div className='cours-fr-grid'>
                  {certificationGroups.available.map(cert => (
                    <Link
                      key={cert.key}
                      className='cours-fr-folder-card'
                      to={getCoursFrCertificationHref(cert.key)}
                    >
                      <span className='cours-fr-card-kind'>Certification</span>
                      <span className='cours-fr-folder-label'>
                        {cert.title}
                      </span>
                      <span className='cours-fr-folder-sub'>
                        {cert.subtitle}
                      </span>
                    </Link>
                  ))}
                </div>

                {certificationGroups.upcoming.length > 0 && (
                  <>
                    <h2 className='cours-fr-section-title'>
                      Traductions à venir
                    </h2>
                    <div className='cours-fr-grid'>
                      {certificationGroups.upcoming.map(cert => (
                        <article
                          key={cert.key}
                          className='cours-fr-upcoming-card'
                        >
                          <span className='cours-fr-folder-label'>
                            {cert.title}
                          </span>
                          <span className='cours-fr-folder-sub'>
                            {cert.subtitle}
                          </span>
                          <span className='cours-fr-not-translated'>
                            Traduction à venir
                          </span>
                        </article>
                      ))}
                    </div>
                  </>
                )}
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
                const localChallenges = data.allChallengeNode.nodes
                  .map(({ challenge }) => challenge)
                  .filter(
                    challenge =>
                      challenge.superBlock === superBlock &&
                      isLocalChallenge(challenge)
                  );
                const superBlockChallenges = challengesInStructure(
                  localChallenges,
                  structure
                );
                const progressChallenges = challengesInStructure(
                  localChallenges,
                  structure,
                  { includeExam: false }
                ).filter(
                  challenge =>
                    challenge.challengeType !== challengeTypes.exam &&
                    challenge.challengeType !== challengeTypes.examDownload
                );
                const completedSet = new Set(completedChallengeIds);
                const totalChallenges = progressChallenges.length;
                const doneChallenges = progressChallenges.filter(challenge =>
                  completedSet.has(challenge.id)
                ).length;
                const progressPct =
                  totalChallenges > 0
                    ? Math.round((doneChallenges / totalChallenges) * 100)
                    : 0;
                return (
                  <>
                    <BackBar
                      href='/cours-fr?view=certifications'
                      crumbs={['Cours en français', cert.title]}
                    />
                    <h1 className='cours-fr-title text-center'>{cert.title}</h1>
                    <p className='cours-fr-intro cours-fr-cert-note'>
                      Les blocs qui demandent un backend ou un outil externe
                      sont masqués en local. Le reste s&apos;ouvre dans
                      l&apos;éditeur du navigateur.
                    </p>
                    <p className='cours-fr-exam-launch'>
                      <Link
                        className='cours-fr-exam-btn'
                        to={`/exam-fr?cert=${encodeURIComponent(cert.key)}`}
                      >
                        Passer l&apos;examen
                      </Link>
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
                      <div className='cours-fr-progress'>
                        <div className='cours-fr-progress-head'>
                          <span className='cours-fr-progress-label'>
                            {doneChallenges}/{totalChallenges} exercices
                            terminés
                          </span>
                          <span className='cours-fr-progress-pct'>
                            {progressPct}%
                          </span>
                        </div>
                        {/* Barre purement visuelle : la valeur est deja
                            annoncee par le texte ci-dessus. */}
                        <div
                          className='cours-fr-progress-track'
                          aria-hidden='true'
                        >
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

function BackBar({ href, crumbs }: { href: string; crumbs: string[] }) {
  return (
    <div className='cours-fr-backbar'>
      <Link className='cours-fr-back-btn' to={href}>
        ← Retour
      </Link>
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
