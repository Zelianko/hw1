import request from 'supertest';
import express from 'express';

import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';

import { VideoInputDto } from '../../../src/videos/dto/video.input.dto';
import { UpdateVideoInputDto } from '../../../src/videos/dto/video.update.dto';
import { AvailableResolutions } from '../../../src/videos/types/video';


describe('Video API', () => {
    const app = express();
    setupApp(app);


    const testVideoData: VideoInputDto = {
        title: 'Test video',
        author: 'Valentin',
        availableResolutions: [
            AvailableResolutions.P720,
        ],
        canBeDownloaded: false,
        minAgeRestriction: null,
    };


    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(HttpStatus.NoContent);
    });



    it('should create video; POST /videos', async () => {

        const response = await request(app)
            .post('/videos')
            .send(testVideoData)
            .expect(HttpStatus.Created);


        expect(response.body).toEqual({
            id: expect.any(Number),
            title: testVideoData.title,
            author: testVideoData.author,
            availableResolutions:
            testVideoData.availableResolutions,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
        });

    });





    it('should return videos list; GET /videos', async () => {


        await request(app)
            .post('/videos')
            .send({
                ...testVideoData,
                title: 'Video 1',
            })
            .expect(HttpStatus.Created);



        await request(app)
            .post('/videos')
            .send({
                ...testVideoData,
                title: 'Video 2',
            })
            .expect(HttpStatus.Created);



        const response = await request(app)
            .get('/videos')
            .expect(HttpStatus.Ok);



        expect(response.body)
            .toBeInstanceOf(Array);


        expect(response.body.length)
            .toBeGreaterThanOrEqual(2);

    });






    it('should return video by id; GET /videos/:id', async () => {


        const createResponse = await request(app)
            .post('/videos')
            .send(testVideoData)
            .expect(HttpStatus.Created);



        const videoId = createResponse.body.id;



        const response = await request(app)
            .get(`/videos/${videoId}`)
            .expect(HttpStatus.Ok);



        expect(response.body).toEqual({
            ...createResponse.body,
            id: expect.any(Number),
        });

    });







    it('should update video; PUT /videos/:id', async () => {


        const createResponse = await request(app)
            .post('/videos')
            .send(testVideoData)
            .expect(HttpStatus.Created);



        const updateVideoData: UpdateVideoInputDto = {
            title: 'Updated video',
            author: 'Updated author',
            availableResolutions: [
                AvailableResolutions.P1080,
            ],
            canBeDownloaded: true,
            minAgeRestriction: 18,
            publicationDate: new Date().toISOString(),
        };



        await request(app)
            .put(`/videos/${createResponse.body.id}`)
            .send(updateVideoData)
            .expect(HttpStatus.NoContent);




        const response = await request(app)
            .get(`/videos/${createResponse.body.id}`)
            .expect(HttpStatus.Ok);




        expect(response.body).toEqual({
            id: createResponse.body.id,
            ...updateVideoData,
            createdAt: expect.any(String),
        });

    });







    it('should delete video and check after NOT FOUND; DELETE /videos/:id', async () => {


        const createResponse = await request(app)
            .post('/videos')
            .send(testVideoData)
            .expect(HttpStatus.Created);



        const videoId = createResponse.body.id;



        await request(app)
            .delete(`/videos/${videoId}`)
            .expect(HttpStatus.NoContent);



        await request(app)
            .get(`/videos/${videoId}`)
            .expect(HttpStatus.NotFound);

    });

});