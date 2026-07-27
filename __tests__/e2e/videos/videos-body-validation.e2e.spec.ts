import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { VideoInputDto } from '../../../src/videos/dto/video.input.dto';
import { UpdateVideoInputDto } from '../../../src/videos/dto/video.update.dto';
import { AvailableResolutions } from '../../../src/videos/types/video';

describe('Video body validation check', () => {
    const app = express();
    setupApp(app);

    const correctTestVideoData: VideoInputDto = {
        title: 'Test video',
        author: 'Valentin',
        canBeDownloaded: false,
        minAgeRestriction: null,
        availableResolutions: [AvailableResolutions.P720],
    };

    const correctUpdateVideoData: UpdateVideoInputDto = {
        title: 'Test video',
        author: 'Valentin',
        availableResolutions: [AvailableResolutions.P720],
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: new Date().toISOString(),
    };

    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HttpStatus.NoContent);
    });


    it('should not create video when incorrect body passed; POST /api/videos', async () => {
        const invalidDataSet1 = await request(app)
            .post('/videos')
            .send({
                ...correctTestVideoData,
                title: '',
                author: '',
                availableResolutions: [],
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorMessages).toHaveLength(3);


        const invalidDataSet2 = await request(app)
            .post('/videos')
            .send({
                ...correctTestVideoData,
                title: 'a'.repeat(41),
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet2.body.errorMessages).toHaveLength(1);


        const invalidDataSet3 = await request(app)
            .post('/videos')
            .send({
                ...correctTestVideoData,
                author: 'a'.repeat(21),
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet3.body.errorMessages).toHaveLength(1);


        const invalidDataSet4 = await request(app)
            .post('/videos')
            .send({
                ...correctTestVideoData,
                availableResolutions: ['P999'],
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet4.body.errorMessages).toHaveLength(1);


        const videoListResponse = await request(app)
            .get('/videos');

        expect(videoListResponse.body).toHaveLength(0);
    });



    it('should not update video when incorrect data passed; PUT videos/:id', async () => {
        const {
            body: { id: createdVideoId },
        } = await request(app)
            .post('/videos')
            .send(correctTestVideoData)
            .expect(HttpStatus.Created);


        const invalidDataSet1 = await request(app)
            .put(`/videos/${createdVideoId}`)
            .send({
                ...correctUpdateVideoData,
                title: '',
                author: '',
                availableResolutions: [],
            })
            .expect(HttpStatus.BadRequest);


        expect(invalidDataSet1.body.errorMessages).toHaveLength(3);



        const invalidDataSet2 = await request(app)
            .put(`/videos/${createdVideoId}`)
            .send({
                ...correctUpdateVideoData,
                title: 'a'.repeat(41),
            })
            .expect(HttpStatus.BadRequest);


        expect(invalidDataSet2.body.errorMessages).toHaveLength(1);



        const videoResponse = await request(app)
            .get(`/videos/${createdVideoId}`);


        expect(videoResponse.body).toEqual({
            id: createdVideoId,
            title: correctTestVideoData.title,
            author: correctTestVideoData.author,
            availableResolutions: correctTestVideoData.availableResolutions,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
        });
    });



    it('should not create/update video with invalid age restriction', async () => {
        const invalidDataSet1 = await request(app)
            .post('/videos')
            .send({
                ...correctTestVideoData,
                minAgeRestriction: 0,
            })
            .expect(HttpStatus.BadRequest);


        expect(invalidDataSet1.body.errorMessages).toHaveLength(1);



        const invalidDataSet2 = await request(app)
            .post('/videos')
            .send({
                ...correctTestVideoData,
                minAgeRestriction: 19,
            })
            .expect(HttpStatus.BadRequest);


        expect(invalidDataSet2.body.errorMessages).toHaveLength(1);
    });



    it('should not update video when invalid resolutions passed; PUT /videos/:id', async () => {
        const {
            body: { id: createdVideoId },
        } = await request(app)
            .post('/videos')
            .send(correctTestVideoData)
            .expect(HttpStatus.Created);



        await request(app)
            .put(`/videos/${createdVideoId}`)
            .send({
                ...correctUpdateVideoData,
                availableResolutions: [
                    AvailableResolutions.P720,
                    'P999',
                ],
            })
            .expect(HttpStatus.BadRequest);



        const videoResponse = await request(app)
            .get(`/videos/${createdVideoId}`);



        expect(videoResponse.body.availableResolutions)
            .toEqual([AvailableResolutions.P720]);
    });
});