import React from 'react';
import './progress.scss';
import { ProgressBar, Step } from 'react-step-progress-bar';
import { Typography } from '@mui/material';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import { useLocation, useNavigate } from 'react-router-dom';

type ProgressDataType = {
  id: string;
  page: string;
  title?: string;
  subText?: string;
};

type MultiStepProgressBarProps = {
  page: string;
  onPageNumberClick: (pageNumber: string, action?: string) => void;
  ProgressDataSet: ProgressDataType[];
};

const MultiStepProgressBar = ({
  page,
  onPageNumberClick,
  ProgressDataSet,
}: MultiStepProgressBarProps) => {
  let stepPercentage = 0;
  const totalSteps = ProgressDataSet.length;

  // Get the current location object
  const location = useLocation();
  const navigate = useNavigate();

  // Get the value of the nextPage parameter
  const searchParams = new URLSearchParams(location.search);

  const currentPageIndex = ProgressDataSet.findIndex(
    (step: { page: string }) => step.page === page,
  );
  if (currentPageIndex > -1) {
    stepPercentage += ((currentPageIndex + 1) / totalSteps) * 100; // adjust to ensure completion at 100%
  }

  // for knowing if the step is completed or not
  const isProrgressCompleted = ProgressDataSet?.findIndex((progress) => progress.page === page);

  return (
    <ProgressBar percent={stepPercentage}>
      {ProgressDataSet?.map((progress: any) => (
        <Step key={progress?.id} className="hii">
          {({ accomplished, index }: any) => (
            <>
              <div
                className={`indexedStep ${page === progress?.page ? 'active' : ''} ${
                  accomplished ? 'accomplished' : null
                } ${index < isProrgressCompleted ? 'complete' : ''}`}
                onClick={() => {
                  onPageNumberClick(`${index + 1}`);
                  let nextPage = searchParams.get('nextPage');
                  if (nextPage) {
                    searchParams.set('nextPage', `${index + 1}`);
                    // Replace the current URL with the updated query parameters
                    navigate({
                      pathname: location.pathname,
                      search: searchParams.toString(),
                    });
                  } else if (location?.pathname?.includes('edit')) {
                    searchParams.set('nextPage', `${index + 1}`);
                    navigate({ pathname: location?.pathname, search: searchParams.toString() });
                  }
                }}>
                {!!(isProrgressCompleted >= index) && <span></span>}
                {!!(index < isProrgressCompleted) && (
                  <div className="complete__icon">
                    <DoneOutlinedIcon />
                  </div>
                )}
              </div>
              {/* should pass through props */}
              {progress?.title || progress?.subText ? (
                <div className="block__description">
                  {progress?.title && <div className="block__heading">{progress?.title}</div>}
                  {progress?.subText && <Typography>{progress?.subText}</Typography>}
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </Step>
      ))}
    </ProgressBar>
  );
};

export default MultiStepProgressBar;
