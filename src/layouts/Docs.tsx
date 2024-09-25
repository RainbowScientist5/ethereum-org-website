import { useRouter } from "next/router"
import type { HTMLAttributes } from "react"
import {
  Badge,
  Box,
  type BoxProps,
  Flex,
  type FlexProps,
  type ListProps,
  OrderedList as ChakraOrderedList,
  UnorderedList as ChakraUnorderedList,
  useToken,
} from "@chakra-ui/react"

import { ChildOnlyProp } from "@/lib/types"
import type { DocsFrontmatter, MdPageContent } from "@/lib/interfaces"

import BannerNotification from "@/components/Banners/BannerNotification"
import { ButtonLink } from "@/components/Buttons"
import CallToContribute from "@/components/CallToContribute"
import Card from "@/components/Card"
import Codeblock from "@/components/Codeblock"
import DeveloperDocsLinks from "@/components/DeveloperDocsLinks"
import DocsNav from "@/components/DocsNav"
import Emoji from "@/components/Emoji"
import FeedbackCard from "@/components/FeedbackCard"
import FileContributors from "@/components/FileContributors"
import GlossaryTooltip from "@/components/Glossary/GlossaryTooltip"
import Link from "@/components/Link"
import MainArticle from "@/components/MainArticle"
import {
  Heading1 as MdHeading1,
  Heading2 as MdHeading2,
  Heading3 as MdHeading3,
  Heading4 as MdHeading4,
  Paragraph,
} from "@/components/MdComponents"
import RollupProductDevDoc from "@/components/RollupProductDevDoc"
import SideNav from "@/components/SideNav"
import SideNavMobile from "@/components/SideNavMobile"
import TableOfContents from "@/components/TableOfContents"
import Translation from "@/components/Translation"
import { Divider } from "@/components/ui/divider"
import { mdxTableComponents } from "@/components/ui/Table"
import YouTube from "@/components/YouTube"

import { cn } from "@/lib/utils/cn"
import { getEditPath } from "@/lib/utils/editPath"

const Page = (props: ChildOnlyProp & Pick<FlexProps, "dir">) => (
  <Flex
    direction="column"
    w="full"
    borderBottom="1px"
    borderColor="border"
    {...props}
  />
)

type ContentContainerProps = Pick<BoxProps, "children" | "dir">

const ContentContainer = (props: ContentContainerProps) => (
  <Flex
    justify={"space-between"}
    w="full"
    py={0}
    ps={0}
    pe={{ base: 0, lg: 8 }}
    backgroundColor="ednBackground"
    {...props}
  />
)

const baseHeadingClasses = "font-mono uppercase font-bold scroll-mt-40"

const H1 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <MdHeading1
    className={cn(baseHeadingClasses, "max-md:mt-0 max-md:text-[2rem]")}
    {...props}
  />
)

const H2 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <MdHeading2
    className={cn(
      baseHeadingClasses,
      "mt-12 border-b border-[#e5e5e5] pb-2 text-2xl max-md:leading-4xs dark:border-[#333]"
    )}
    {...props}
  />
)

const baseSubHeadingClasses = "leading-xs font-semibold"

const H3 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <MdHeading3 className={cn(baseSubHeadingClasses, "mt-12")} {...props} />
)

const H4 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <MdHeading4 className={baseSubHeadingClasses} {...props} />
)

const UnorderedList = (props: ListProps) => (
  <ChakraUnorderedList ms="1.45rem" {...props} />
)
const OrderedList = (props: ListProps) => (
  <ChakraOrderedList ms="1.45rem" {...props} />
)

// Apply styles for classes within markdown here
const Content = (props: ChildOnlyProp) => {
  const mdBreakpoint = useToken("breakpoints", "md")

  return (
    <Box
      as={MainArticle}
      flex={`1 1 ${mdBreakpoint}`}
      w={{ base: "full", lg: "0" }}
      pt={{ base: 8, md: 12 }}
      pb={{ base: 8, md: 16 }}
      px={{ base: 8, md: 16 }}
      m="0 auto"
      sx={{
        ".citation": {
          p: {
            color: "text200",
          },
        },
      }}
      {...props}
    />
  )
}

const BackToTop = (props: ChildOnlyProp) => (
  <Flex
    display={{ lg: "none" }}
    mt={12}
    pt={8}
    borderTop="1px"
    borderColor="border"
    {...props}
  >
    <Link href="#top">
      <Translation id="back-to-top" /> ↑
    </Link>
  </Flex>
)

export const docsComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
  pre: Codeblock,
  ...mdxTableComponents,
  Badge,
  ButtonLink,
  Card,
  CallToContribute,
  DeveloperDocsLinks,
  Divider,
  Emoji,
  GlossaryTooltip,
  RollupProductDevDoc,
  YouTube,
}

type DocsLayoutProps = Pick<
  MdPageContent,
  | "slug"
  | "tocItems"
  | "lastEditLocaleTimestamp"
  | "contributors"
  | "contentNotTranslated"
> &
  Required<Pick<MdPageContent, "lastEditLocaleTimestamp">> &
  ChildOnlyProp & {
    frontmatter: DocsFrontmatter
  }

export const DocsLayout = ({
  children,
  frontmatter,
  tocItems,
  lastEditLocaleTimestamp,
  contributors,
  contentNotTranslated,
}: DocsLayoutProps) => {
  const isPageIncomplete = !!frontmatter.incomplete
  const { asPath: relativePath } = useRouter()
  const absoluteEditPath = getEditPath(relativePath)

  return (
    <Page>
      <SideNavMobile path={relativePath} />
      {isPageIncomplete && (
        <BannerNotification shouldShow={isPageIncomplete}>
          <Translation id="page-developers-docs:banner-page-incomplete" />
        </BannerNotification>
      )}
      <ContentContainer dir={contentNotTranslated ? "ltr" : "unset"}>
        <SideNav path={relativePath} />
        <Content>
          <H1 id="top">{frontmatter.title}</H1>
          <FileContributors
            contributors={contributors}
            lastEditLocaleTimestamp={lastEditLocaleTimestamp}
          />
          <TableOfContents
            editPath={absoluteEditPath}
            items={tocItems}
            isMobile
            maxDepth={frontmatter.sidebarDepth!}
            hideEditButton={!!frontmatter.hideEditButton}
          />
          {children}
          {isPageIncomplete && <CallToContribute editPath={absoluteEditPath} />}
          <BackToTop />
          <FeedbackCard isArticle />
          <DocsNav contentNotTranslated={contentNotTranslated} />
        </Content>
        {tocItems && (
          <TableOfContents
            editPath={absoluteEditPath}
            items={tocItems}
            maxDepth={frontmatter.sidebarDepth!}
            hideEditButton={!!frontmatter.hideEditButton}
            pt={isPageIncomplete ? "5rem" : "3rem"}
          />
        )}
      </ContentContainer>
    </Page>
  )
}
