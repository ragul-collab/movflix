import "../css/Skeleton.css";

function SkeletonCard() {
    return (
        <div className="skeleton-card skeleton-shimmer">
            <div className="skeleton-poster"></div>
            <div className="skeleton-info">
                <div className="skeleton-title"></div>
                <div className="skeleton-date"></div>
            </div>
        </div>
    );
}

export default SkeletonCard;
