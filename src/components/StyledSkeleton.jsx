import { Skeleton } from "../../app/components/ui/skeleton"

const StyledSkeleton = ({ styles }) => {
  return <Skeleton className={`rounded-sm bg-border dark:bg-muted ${styles}`} />
}

export default StyledSkeleton
