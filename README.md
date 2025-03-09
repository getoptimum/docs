<p align="center">
  <a href="https://www.getoptimum.xyz/">
    <img src="static/img/banner.png" alt="Logo">
  </a>

  <h2 align="center">Optimum Docs</h2>

  <p align="center">
    Welcome to the official documentation repository for <a href="https://www.getoptimum.xyz/">Optimum</a>.
    Here you'll find comprehensive guides, tutorials, and reference materials to
    help you make the most out of Optimum.
    <br />
    <a href="https://docs.getoptimum.xyz"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/getoptimum/docs/issues">Report Bug</a>
    ·
    <a href="https://github.com/getoptimum/docs/issues">Request Feature</a>
  </p>
</p>

## Getting Started

This section describes how you can get our documentation portal up and running
on your machine.

### Prerequisites

* [node](https://nodejs.org/en/)
* [npm](https://www.npmjs.com/)
* [vitepress](https://vitepress.dev/guide/getting-started)

### Installation

1. Clone the repo

   ```sh
   $ git clone https://github.com/getoptimum/docs.git
   ```

2. Install NPM packages

   ```sh
   $ npm install
   ```

3. Run the app

   ```sh
   $ make run-dev
   ```

## Directory Structure

<!-- TODO(bez): Add tree structure -->

## Contribution Guidelines

We love contributions from the community! Whether you're fixing typos,
improving content clarity, or adding new topics, every contribution helps.

* Fork & clone: Fork this repository and clone it to your local machine.
* Branch: Always create a new branch for your changes. Naming it relevantly.
* Commit Changes: Make your changes and commit them with a clear and concise
  commit message.
* Push & Create PR: Push your changes to your fork and create a pull request
  to the main branch of this repository.

Please ensure to review the detailed Contribution Guidelines above before
making a pull request.

### Link Format Guidelines

When adding internal links to documentation, please use the following format:
`[link text](/base-working-dir/subdir/page.md#section-id)`, i.e.
`[link text](/how-to-guides/quick-start.md#get-your-auth-token)`

This format ensures long-term compatibility and consistent behavior across
different platforms and documentation builds.

## Feedback & Suggestions

We value feedback from the community. If you have suggestions for improvements
or find any discrepancies in the documentation, please raise an issue in this
repository.
