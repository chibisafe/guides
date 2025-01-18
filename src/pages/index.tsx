import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";
import { ChibisafeLogo } from "../components/chibisafe-logo";
// function HomepageHeader() {
// 	const { siteConfig } = useDocusaurusContext();
// 	return (
// 		<header className={clsx("hero hero--primary", styles.heroBanner)}>
// 			<div className="container">
// 				<Heading as="h1" className="hero__title">
// 					{siteConfig.title}
// 				</Heading>
// 				<p className="hero__subtitle">{siteConfig.tagline}</p>
// 				<div className={styles.buttons}>
// 					<Link
// 						className="button button--secondary button--lg"
// 						to="/docs/intro"
// 					>
// 						Docusaurus Tutorial - 5min ⏱️
// 					</Link>
// 				</div>
// 			</div>
// 		</header>
// 	);
// }

export default function Home(): ReactNode {
	const { siteConfig } = useDocusaurusContext();
	return (
		<Layout
			title={`${siteConfig.title}`}
			description="Beautiful and performant vault to save all your files in the cloud."
		>
			<div className="custom-background" />
			<div className="custom-container">
				<section className="custom-section">
					<div className="custom-inner-container">
						<div className="custom-flex-container">
							<div className="custom-text-container">
								<h1 className="custom-heading">
									<span className="custom-gradient-text">chibisafe </span>
									is a beautiful <br />
									and performant vault to <br />
									save all your files in the cloud. <br />
								</h1>
								<p className="custom-paragraph">
									A modern and self-hosted take on file uploading services that
									can handle anything you throw at it thanks to it's robust and
									fast API, chunked uploads support and more.
								</p>
								<div className="custom-link-container">
									<Link href="/docs/intro" className="custom-link">
										Get Started
									</Link>
								</div>
							</div>

							<div className="custom-logo-container">
								<ChibisafeLogo className="custom-logo" />
							</div>
						</div>
					</div>
				</section>
			</div>
		</Layout>
	);
}
