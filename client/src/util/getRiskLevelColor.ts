const getRiskLevelColor = (riskLevel: string): string => {
    const riskLevelColorMap = {
        low: "rgb(0, 212, 116)",
        medium: "rgb(255, 201, 0)",
        high: "rgb(255, 150, 0)",
        critical: "rgb(255, 0, 52)",
    }
    
    return riskLevelColorMap[riskLevel];
}

export default getRiskLevelColor;